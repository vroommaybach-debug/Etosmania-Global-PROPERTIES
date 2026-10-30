import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Property,
  DevelopmentProject,
  CoOwnershipProject,
  ServiceItem,
  EnquiryRecord,
  LandingPageConfig,
  Testimonial,
} from '../types';
import {
  PROPERTIES_DATA,
  DEVELOPMENTS_DATA,
  CO_OWNERSHIP_PROJECTS,
  SERVICES_DATA,
  OFFICE_DETAILS,
  TESTIMONIALS,
} from '../data/mockData';
import {
  db,
  auth,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  onAuthStateChanged,
  User,
} from '../firebase';

interface DataContextType {
  properties: Property[];
  developments: DevelopmentProject[];
  coOwnershipProjects: CoOwnershipProject[];
  services: ServiceItem[];
  enquiries: EnquiryRecord[];
  landingConfig: LandingPageConfig;
  testimonials: Testimonial[];
  firebaseUser: User | null;
  isFirestoreConnected: boolean;
  addProperty: (property: Omit<Property, 'id' | 'slug'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  addDevelopment: (dev: Omit<DevelopmentProject, 'id' | 'slug'>) => void;
  updateDevelopment: (id: string, updates: Partial<DevelopmentProject>) => void;
  deleteDevelopment: (id: string) => void;
  addCoOwnershipProject: (pool: Omit<CoOwnershipProject, 'id' | 'slug'>) => void;
  updateCoOwnershipProject: (id: string, updates: Partial<CoOwnershipProject>) => void;
  deleteCoOwnershipProject: (id: string) => void;
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  addEnquiry: (enquiry: Omit<EnquiryRecord, 'id' | 'createdAt' | 'status'>) => void;
  updateEnquiryStatus: (id: string, status: EnquiryRecord['status']) => void;
  deleteEnquiry: (id: string) => void;
  updateLandingConfig: (updates: Partial<LandingPageConfig>) => void;
  resetToDefaults: () => void;
}

const DEFAULT_LANDING_CONFIG: LandingPageConfig = {
  heroStyle: 'full-bleed',
  heroTagline: 'Lagos · Private Wealth & Real Estate',
  heroHeadline: 'Real Estate Gold You Are Looking For.',
  heroSubheadline:
    'World-class residential and commercial properties, verified land & houses, fractional co-ownership syndicates, and institutional property management across Lagos.',
  heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85',
  announcementBanner:
    'Now Allocating: Etosmania Gold Crest Courts (Ajah) & Co-Ownership Property Slots from ₦5M — Schedule a Private Physical or Live Video Tour',
  showAnnouncement: true,
  stats: {
    yearsExperience: '100% Verified',
    totalVolume: '8 Core Pillars',
    verifiedAssets: 'C of O & Consent',
    diasporaSatisfaction: '99.4%',
  },
  contactPhone: OFFICE_DETAILS.phone,
  contactWhatsapp: OFFICE_DETAILS.whatsapp,
  contactEmail: OFFICE_DETAILS.email,
  contactAddress: OFFICE_DETAILS.address,
};

const SEED_ENQUIRIES: EnquiryRecord[] = [
  {
    id: 'ENQ-1001',
    type: 'Inspection',
    name: 'Engr. Tunde Adebayo',
    email: 't.adebayo@energycorp.ng',
    phone: '+234 803 555 0192',
    subject: 'Physical Inspection: The Sovereign Gold 5-Bed Duplex (Thomas Estate, Ajah)',
    message:
      'I would like to visit your office at 10B Thomas Estate, Ajah this Thursday at 11:00 AM to inspect the 5-Bedroom Detached Duplex and review the Governor’s Consent.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    status: 'New',
    meta: {
      mode: 'In-Person Viewing (10B Thomas Estate, Ajah)',
      date: '2026-05-18',
      time: '11:00 AM (WAT)',
    },
  },
  {
    id: 'ENQ-1002',
    type: 'Service',
    name: 'Dr. Ngozi Okonkwo (UK Diaspora)',
    email: 'ngozi.okonkwo@nhs.uk',
    phone: '+44 7700 900412',
    subject: 'Real Estate Co-ownership: 2 Slots in Thomas Estate Duplex Pool',
    message:
      'Interested in reserving 2 Co-Ownership slots (₦24M total) and scheduling a live WhatsApp video call to review the SPV Co-Ownership Deed.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    status: 'In Progress',
    meta: {
      service: 'Real Estate Co-ownership',
      budget: '₦24M (2 Co-Ownership Slots)',
    },
  },
  {
    id: 'ENQ-1003',
    type: 'Development',
    name: 'Alhaji Musa Danjuma',
    email: 'mdanjuma@danjumaholdings.com',
    phone: '+234 809 221 8834',
    subject: 'Sales of Land: 4 Plots at Purple Haven, Ibeju-Lekki',
    message:
      'Please send the C of O survey coordinates and 6-month installment breakdown for four 600 SQM plots in Purple Haven.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    status: 'Closed',
    meta: {
      project: 'Purple Haven Serviced Land & Villas, Ibeju-Lekki',
    },
  },
];

const STORAGE_KEYS = {
  PROPERTIES: 'etosmania_global_properties_v2',
  DEVELOPMENTS: 'etosmania_global_developments_v2',
  CO_OWNERSHIP: 'etosmania_global_coownership_v2',
  SERVICES: 'etosmania_global_services_v2',
  ENQUIRIES: 'etosmania_global_enquiries_v2',
  LANDING: 'etosmania_global_landing_v2',
};

const DataContext = createContext<DataContextType | undefined>(undefined);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function sanitizeForFirestore<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
      return saved ? JSON.parse(saved) : PROPERTIES_DATA;
    } catch {
      return PROPERTIES_DATA;
    }
  });

  const [developments, setDevelopments] = useState<DevelopmentProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEVELOPMENTS);
      return saved ? JSON.parse(saved) : DEVELOPMENTS_DATA;
    } catch {
      return DEVELOPMENTS_DATA;
    }
  });

  const [coOwnershipProjects, setCoOwnershipProjects] = useState<CoOwnershipProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CO_OWNERSHIP);
      return saved ? JSON.parse(saved) : CO_OWNERSHIP_PROJECTS;
    } catch {
      return CO_OWNERSHIP_PROJECTS;
    }
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : SERVICES_DATA;
    } catch {
      return SERVICES_DATA;
    }
  });

  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return saved ? JSON.parse(saved) : SEED_ENQUIRIES;
    } catch {
      return SEED_ENQUIRIES;
    }
  });

  const [landingConfig, setLandingConfig] = useState<LandingPageConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANDING);
      return saved ? { ...DEFAULT_LANDING_CONFIG, ...JSON.parse(saved) } : DEFAULT_LANDING_CONFIG;
    } catch {
      return DEFAULT_LANDING_CONFIG;
    }
  });

  const [testimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync across all collections in dedicated database:
  // ai-studio-etosmaniaglobalp-a4102c83-0b73-496b-94b6-83f133176e3b
  useEffect(() => {
    const unsubProps = onSnapshot(
      collection(db, 'properties'),
      (snapshot) => {
        setIsFirestoreConnected(true);
        if (!snapshot.empty) {
          const loaded = snapshot.docs
            .map((d) => d.data() as Property)
            .filter((p) => !String(p.title || '').toLowerCase().includes('bahams'));
          if (loaded.length > 0) {
            loaded.sort((a, b) => a.id.localeCompare(b.id));
            setProperties(loaded);
          }
        } else {
          // Seed initial Etosmania properties into dedicated Firestore DB
          const batch = writeBatch(db);
          PROPERTIES_DATA.forEach((p) => {
            batch.set(doc(db, 'properties', p.id), sanitizeForFirestore(p));
          });
          batch.commit().catch(() => {});
        }
      },
      () => {}
    );

    const unsubDevs = onSnapshot(
      collection(db, 'developments'),
      (snapshot) => {
        setIsFirestoreConnected(true);
        if (!snapshot.empty) {
          const loaded = snapshot.docs
            .map((d) => d.data() as DevelopmentProject)
            .filter((d) => !String(d.developer || '').toLowerCase().includes('bahams'));
          if (loaded.length > 0) {
            loaded.sort((a, b) => a.id.localeCompare(b.id));
            setDevelopments(loaded);
          }
        } else {
          const batch = writeBatch(db);
          DEVELOPMENTS_DATA.forEach((d) => {
            batch.set(doc(db, 'developments', d.id), sanitizeForFirestore(d));
          });
          batch.commit().catch(() => {});
        }
      },
      () => {}
    );

    const unsubServices = onSnapshot(
      collection(db, 'services'),
      (snapshot) => {
        setIsFirestoreConnected(true);
        if (!snapshot.empty) {
          const loaded = snapshot.docs
            .map((d) => d.data() as ServiceItem)
            .filter((s) => !String(s.description || '').toLowerCase().includes('bahams'));
          if (loaded.length > 0) {
            setServices(loaded);
          }
        } else {
          const batch = writeBatch(db);
          SERVICES_DATA.forEach((s) => {
            batch.set(doc(db, 'services', s.id), sanitizeForFirestore(s));
          });
          batch.commit().catch(() => {});
        }
      },
      () => {}
    );

    const unsubCoOwn = onSnapshot(
      doc(db, 'settings', 'coOwnershipCatalog'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as { items?: CoOwnershipProject[] };
          if (Array.isArray(data?.items) && data.items.length > 0) {
            setCoOwnershipProjects(data.items);
          }
        } else {
          setDoc(
            doc(db, 'settings', 'coOwnershipCatalog'),
            { items: sanitizeForFirestore(CO_OWNERSHIP_PROJECTS), updatedAt: new Date().toISOString() },
            { merge: true }
          ).catch(() => {});
        }
      },
      () => {}
    );

    const unsubLanding = onSnapshot(
      doc(db, 'settings', 'landingConfig'),
      (snapshot) => {
        setIsFirestoreConnected(true);
        if (snapshot.exists()) {
          const data = snapshot.data() as LandingPageConfig;
          if (data.heroHeadline && !String(data.heroHeadline).toLowerCase().includes('bahams')) {
            setLandingConfig((prev) => ({ ...prev, ...data }));
          }
        } else {
          setDoc(
            doc(db, 'settings', 'landingConfig'),
            sanitizeForFirestore({ ...DEFAULT_LANDING_CONFIG, updatedAt: new Date().toISOString() }),
            { merge: true }
          ).catch(() => {});
        }
      },
      () => {}
    );

    const unsubEnquiries = onSnapshot(
      collection(db, 'enquiries'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((d) => d.data() as EnquiryRecord);
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setEnquiries(loaded);
        }
      },
      () => {}
    );

    return () => {
      unsubProps();
      unsubDevs();
      unsubServices();
      unsubCoOwn();
      unsubLanding();
      unsubEnquiries();
    };
  }, []);

  // LocalStorage persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    } catch {}
  }, [properties]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEVELOPMENTS, JSON.stringify(developments));
    } catch {}
  }, [developments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CO_OWNERSHIP, JSON.stringify(coOwnershipProjects));
    } catch {}
  }, [coOwnershipProjects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch {}
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch {}
  }, [enquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANDING, JSON.stringify(landingConfig));
    } catch {}
  }, [landingConfig]);

  // 1. Properties CRUD
  const addProperty = async (newProp: Omit<Property, 'id' | 'slug'>) => {
    const id = `EGP-${Math.floor(200 + Math.random() * 800)}`;
    const slug = `${slugify(newProp.title)}-${id.toLowerCase()}`;
    const propertyRecord: Property = sanitizeForFirestore({ ...newProp, id, slug });

    setProperties((prev) => [propertyRecord, ...prev]);
    try {
      await setDoc(doc(db, 'properties', id), propertyRecord);
    } catch {}
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    let updatedItem: Property | null = null;
    setProperties((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextSlug = updates.title
            ? `${slugify(updates.title)}-${id.toLowerCase()}`
            : item.slug;
          updatedItem = sanitizeForFirestore({ ...item, ...updates, slug: nextSlug });
          return updatedItem;
        }
        return item;
      })
    );

    if (updatedItem) {
      try {
        await setDoc(doc(db, 'properties', id), updatedItem);
      } catch {}
    }
  };

  const deleteProperty = async (id: string) => {
    setProperties((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteDoc(doc(db, 'properties', id));
    } catch {}
  };

  // 2. Developments CRUD
  const addDevelopment = async (newDev: Omit<DevelopmentProject, 'id' | 'slug'>) => {
    const id = `DEV-${Math.floor(10 + Math.random() * 89)}`;
    const slug = `${slugify(newDev.name)}-${id.toLowerCase()}`;
    const devRecord: DevelopmentProject = sanitizeForFirestore({ ...newDev, id, slug });

    setDevelopments((prev) => [devRecord, ...prev]);
    try {
      await setDoc(doc(db, 'developments', id), devRecord);
    } catch {}
  };

  const updateDevelopment = async (id: string, updates: Partial<DevelopmentProject>) => {
    let updatedItem: DevelopmentProject | null = null;
    setDevelopments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextSlug = updates.name
            ? `${slugify(updates.name)}-${id.toLowerCase()}`
            : item.slug;
          updatedItem = sanitizeForFirestore({ ...item, ...updates, slug: nextSlug });
          return updatedItem;
        }
        return item;
      })
    );

    if (updatedItem) {
      try {
        await setDoc(doc(db, 'developments', id), updatedItem);
      } catch {}
    }
  };

  const deleteDevelopment = async (id: string) => {
    setDevelopments((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteDoc(doc(db, 'developments', id));
    } catch {}
  };

  // 3. Co-Ownership Syndicates CRUD
  const syncCoOwnershipToFirestore = async (nextList: CoOwnershipProject[]) => {
    try {
      await setDoc(
        doc(db, 'settings', 'coOwnershipCatalog'),
        sanitizeForFirestore({ items: nextList })
      );
    } catch {}
  };

  const addCoOwnershipProject = async (pool: Omit<CoOwnershipProject, 'id' | 'slug'>) => {
    const id = `EGP-CO-${Math.floor(10 + Math.random() * 89)}`;
    const slug = `${slugify(pool.title)}-${id.toLowerCase()}`;
    const record: CoOwnershipProject = sanitizeForFirestore({ ...pool, id, slug });
    const nextList = [record, ...coOwnershipProjects];
    setCoOwnershipProjects(nextList);
    await syncCoOwnershipToFirestore(nextList);
  };

  const updateCoOwnershipProject = async (
    id: string,
    updates: Partial<CoOwnershipProject>
  ) => {
    const nextList = coOwnershipProjects.map((item) =>
      item.id === id ? sanitizeForFirestore({ ...item, ...updates }) : item
    );
    setCoOwnershipProjects(nextList);
    await syncCoOwnershipToFirestore(nextList);
  };

  const deleteCoOwnershipProject = async (id: string) => {
    const nextList = coOwnershipProjects.filter((item) => item.id !== id);
    setCoOwnershipProjects(nextList);
    await syncCoOwnershipToFirestore(nextList);
  };

  // 4. Services CRUD
  const addService = async (newSvc: Omit<ServiceItem, 'id'>) => {
    const id = slugify(newSvc.title) || `service-${Date.now()}`;
    const record: ServiceItem = sanitizeForFirestore({ ...newSvc, id });
    setServices((prev) => [...prev, record]);
    try {
      await setDoc(doc(db, 'services', id), record);
    } catch {}
  };

  const updateService = async (id: string, updates: Partial<ServiceItem>) => {
    let updatedItem: ServiceItem | null = null;
    setServices((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          updatedItem = sanitizeForFirestore({ ...item, ...updates });
          return updatedItem;
        }
        return item;
      })
    );
    if (updatedItem) {
      try {
        await setDoc(doc(db, 'services', id), updatedItem);
      } catch {}
    }
  };

  const deleteService = async (id: string) => {
    setServices((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch {}
  };

  // 5. Enquiries CRUD
  const addEnquiry = async (newEnq: Omit<EnquiryRecord, 'id' | 'createdAt' | 'status'>) => {
    const id = `ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const record: EnquiryRecord = sanitizeForFirestore({
      ...newEnq,
      id,
      createdAt: new Date().toISOString(),
      status: 'New',
    });

    setEnquiries((prev) => [record, ...prev]);
    try {
      await setDoc(doc(db, 'enquiries', id), record);
    } catch {}
  };

  const updateEnquiryStatus = async (id: string, status: EnquiryRecord['status']) => {
    let updatedRecord: EnquiryRecord | null = null;
    setEnquiries((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          updatedRecord = sanitizeForFirestore({ ...item, status });
          return updatedRecord;
        }
        return item;
      })
    );

    if (updatedRecord) {
      try {
        await setDoc(doc(db, 'enquiries', id), updatedRecord);
      } catch {}
    }
  };

  const deleteEnquiry = async (id: string) => {
    setEnquiries((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteDoc(doc(db, 'enquiries', id));
    } catch {}
  };

  // 6. Landing & Global CMS
  const updateLandingConfig = async (updates: Partial<LandingPageConfig>) => {
    const nextConfig = sanitizeForFirestore({ ...landingConfig, ...updates });
    setLandingConfig(nextConfig);
    try {
      await setDoc(doc(db, 'settings', 'landingConfig'), nextConfig);
    } catch {}
  };

  const resetToDefaults = async () => {
    setProperties(PROPERTIES_DATA);
    setDevelopments(DEVELOPMENTS_DATA);
    setCoOwnershipProjects(CO_OWNERSHIP_PROJECTS);
    setServices(SERVICES_DATA);
    setEnquiries(SEED_ENQUIRIES);
    setLandingConfig(DEFAULT_LANDING_CONFIG);

    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));

    try {
      const batch = writeBatch(db);
      for (const prop of PROPERTIES_DATA) {
        batch.set(doc(db, 'properties', prop.id), sanitizeForFirestore(prop));
      }
      for (const dev of DEVELOPMENTS_DATA) {
        batch.set(doc(db, 'developments', dev.id), sanitizeForFirestore(dev));
      }
      for (const svc of SERVICES_DATA) {
        batch.set(doc(db, 'services', svc.id), sanitizeForFirestore(svc));
      }
      batch.set(
        doc(db, 'settings', 'coOwnershipCatalog'),
        sanitizeForFirestore({ items: CO_OWNERSHIP_PROJECTS })
      );
      batch.set(
        doc(db, 'settings', 'landingConfig'),
        sanitizeForFirestore(DEFAULT_LANDING_CONFIG)
      );
      await batch.commit();
    } catch {}
  };

  return (
    <DataContext.Provider
      value={{
        properties,
        developments,
        coOwnershipProjects,
        services,
        enquiries,
        landingConfig,
        testimonials,
        firebaseUser,
        isFirestoreConnected,
        addProperty,
        updateProperty,
        deleteProperty,
        addDevelopment,
        updateDevelopment,
        deleteDevelopment,
        addCoOwnershipProject,
        updateCoOwnershipProject,
        deleteCoOwnershipProject,
        addService,
        updateService,
        deleteService,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        updateLandingConfig,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
