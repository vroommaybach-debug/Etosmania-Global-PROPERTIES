import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Property,
  DevelopmentProject,
  InspectionBooking,
  ContactInquiry,
  ServiceItem,
  CoOwnershipAsset,
  SiteConfig,
} from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_DEVELOPMENTS,
  CORE_SERVICES,
  CO_OWNERSHIP_ASSETS,
  DEFAULT_SITE_CONFIG,
} from '../data/mockData';
import { db, auth } from '../firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData.map((provider) => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore sync notice:', JSON.stringify(errInfo));
}

interface DataContextType {
  properties: Property[];
  developments: DevelopmentProject[];
  services: ServiceItem[];
  coOwnershipAssets: CoOwnershipAsset[];
  siteConfig: SiteConfig;
  bookings: InspectionBooking[];
  inquiries: ContactInquiry[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'slug'>) => Promise<void>;
  updateProperty: (property: Property) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  addDevelopment: (dev: Omit<DevelopmentProject, 'id'>) => Promise<void>;
  updateDevelopment: (dev: DevelopmentProject) => Promise<void>;
  deleteDevelopment: (id: string) => Promise<void>;
  addService: (service: Omit<ServiceItem, 'id'>) => Promise<void>;
  updateService: (service: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addCoOwnershipAsset: (asset: Omit<CoOwnershipAsset, 'id'>) => Promise<void>;
  updateCoOwnershipAsset: (asset: CoOwnershipAsset) => Promise<void>;
  deleteCoOwnershipAsset: (id: string) => Promise<void>;
  updateSiteConfig: (config: SiteConfig) => Promise<void>;
  addBooking: (booking: Omit<InspectionBooking, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateBookingStatus: (id: string, status: InspectionBooking['status']) => Promise<void>;
  addInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt'>) => Promise<void>;
  resetDemoData: () => Promise<void>;
  isInspectionModalOpen: boolean;
  selectedPropertyForInspection: { id?: string; title?: string } | null;
  openInspectionModal: (property?: { id: string; title: string }) => void;
  closeInspectionModal: () => void;
  user: User | null;
  isAuthReady: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROPERTIES: 'etosmania_global_properties_v3',
  DEVELOPMENTS: 'etosmania_global_developments_v3',
  SERVICES: 'etosmania_global_services_v3',
  CO_OWNERSHIP: 'etosmania_global_coownership_v3',
  SITE_CONFIG: 'etosmania_global_site_config_v3',
  BOOKINGS: 'etosmania_global_bookings_v3',
  INQUIRIES: 'etosmania_global_inquiries_v3',
};

const REQUIRED_CORRIDOR_PROPERTY_IDS = ['EGP-109', 'EGP-110', 'EGP-111'];
const REQUIRED_DEVELOPMENT_IDS = ['DEV-04'];
const REQUIRED_COOWNERSHIP_IDS = ['EGP-CO-05'];

function mergeMissingSeedItems<T extends { id: string }>(
  loadedItems: T[],
  seedItems: T[],
  requiredIds: string[]
): { merged: T[]; missingToPersist: T[] } {
  const existingIds = new Set(loadedItems.map((item) => item.id));
  const missingToPersist = seedItems.filter(
    (seed) => requiredIds.includes(seed.id) && !existingIds.has(seed.id)
  );
  if (missingToPersist.length === 0) {
    return { merged: loadedItems, missingToPersist: [] };
  }
  return {
    merged: [...missingToPersist, ...loadedItems],
    missingToPersist,
  };
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const { merged } = mergeMissingSeedItems(parsed, INITIAL_PROPERTIES, REQUIRED_CORRIDOR_PROPERTY_IDS);
          return merged;
        }
      }
    } catch (e) {
      console.error('Error loading properties from localStorage', e);
    }
    return INITIAL_PROPERTIES;
  });

  const [developments, setDevelopments] = useState<DevelopmentProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEVELOPMENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const { merged } = mergeMissingSeedItems(parsed, INITIAL_DEVELOPMENTS, REQUIRED_DEVELOPMENT_IDS);
          return merged;
        }
      }
    } catch (e) {
      console.error('Error loading developments from localStorage', e);
    }
    return INITIAL_DEVELOPMENTS;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading services from localStorage', e);
    }
    return CORE_SERVICES;
  });

  const [coOwnershipAssets, setCoOwnershipAssets] = useState<CoOwnershipAsset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CO_OWNERSHIP);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const { merged } = mergeMissingSeedItems(parsed, CO_OWNERSHIP_ASSETS, REQUIRED_COOWNERSHIP_IDS);
          return merged;
        }
      }
    } catch (e) {
      console.error('Error loading co-ownership assets from localStorage', e);
    }
    return CO_OWNERSHIP_ASSETS;
  });

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SITE_CONFIG);
      if (saved) {
        return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading site config from localStorage', e);
    }
    return DEFAULT_SITE_CONFIG;
  });

  const [bookings, setBookings] = useState<InspectionBooking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading bookings from localStorage', e);
      return [];
    }
  });

  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading inquiries from localStorage', e);
      return [];
    }
  });

  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [selectedPropertyForInspection, setSelectedPropertyForInspection] = useState<{
    id?: string;
    title?: string;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    } catch (e) {
      console.error(e);
    }
  }, [properties]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEVELOPMENTS, JSON.stringify(developments));
    } catch (e) {
      console.error(e);
    }
  }, [developments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.error(e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CO_OWNERSHIP, JSON.stringify(coOwnershipAssets));
    } catch (e) {
      console.error(e);
    }
  }, [coOwnershipAssets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SITE_CONFIG, JSON.stringify(siteConfig));
    } catch (e) {
      console.error(e);
    }
  }, [siteConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    } catch (e) {
      console.error(e);
    }
  }, [inquiries]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubProperties = onSnapshot(
      collection(db, 'properties'),
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            const batch = writeBatch(db);
            INITIAL_PROPERTIES.forEach((prop) => {
              const docRef = doc(db, 'properties', prop.id);
              batch.set(docRef, prop);
            });
            await batch.commit();
          } catch (error) {
            console.warn('Initial properties seed skipped:', error);
          }
        } else {
          const props = snapshot.docs.map((d) => d.data() as Property);
          const { merged, missingToPersist } = mergeMissingSeedItems(
            props,
            INITIAL_PROPERTIES,
            REQUIRED_CORRIDOR_PROPERTY_IDS
          );
          if (missingToPersist.length > 0) {
            try {
              const batch = writeBatch(db);
              missingToPersist.forEach((prop) => {
                batch.set(doc(db, 'properties', prop.id), prop);
              });
              await batch.commit();
            } catch (e) {
              console.warn('Syncing new corridor properties to Firestore skipped:', e);
            }
          }
          merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setProperties(merged);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'properties');
      }
    );

    const unsubDevelopments = onSnapshot(
      collection(db, 'developments'),
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            const batch = writeBatch(db);
            INITIAL_DEVELOPMENTS.forEach((dev) => {
              const docRef = doc(db, 'developments', dev.id);
              batch.set(docRef, dev);
            });
            await batch.commit();
          } catch (error) {
            console.warn('Initial developments seed skipped:', error);
          }
        } else {
          const devs = snapshot.docs.map((d) => d.data() as DevelopmentProject);
          const { merged, missingToPersist } = mergeMissingSeedItems(
            devs,
            INITIAL_DEVELOPMENTS,
            REQUIRED_DEVELOPMENT_IDS
          );
          if (missingToPersist.length > 0) {
            try {
              const batch = writeBatch(db);
              missingToPersist.forEach((dev) => {
                batch.set(doc(db, 'developments', dev.id), dev);
              });
              await batch.commit();
            } catch (e) {
              console.warn('Syncing new corridor developments to Firestore skipped:', e);
            }
          }
          setDevelopments(merged);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'developments');
      }
    );

    const unsubServices = onSnapshot(
      collection(db, 'servicesCatalog'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((d) => d.data() as ServiceItem);
          loaded.sort((a, b) => a.number.localeCompare(b.number));
          setServices(loaded);
        }
      },
      () => {}
    );

    const unsubCoOwnership = onSnapshot(
      collection(db, 'coOwnershipCatalog'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((d) => d.data() as CoOwnershipAsset);
          const { merged } = mergeMissingSeedItems(
            loaded,
            CO_OWNERSHIP_ASSETS,
            REQUIRED_COOWNERSHIP_IDS
          );
          setCoOwnershipAssets(merged);
        }
      },
      () => {}
    );

    const unsubSiteConfig = onSnapshot(
      doc(db, 'siteSettings', 'main'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSiteConfig({ ...DEFAULT_SITE_CONFIG, ...(docSnap.data() as SiteConfig) });
        }
      },
      () => {}
    );

    const unsubBookings = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        const bks = snapshot.docs.map((d) => d.data() as InspectionBooking);
        bks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(bks);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'bookings');
      }
    );

    const unsubInquiries = onSnapshot(
      collection(db, 'inquiries'),
      (snapshot) => {
        const inqs = snapshot.docs.map((d) => d.data() as ContactInquiry);
        inqs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setInquiries(inqs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'inquiries');
      }
    );

    return () => {
      unsubProperties();
      unsubDevelopments();
      unsubServices();
      unsubCoOwnership();
      unsubSiteConfig();
      unsubBookings();
      unsubInquiries();
    };
  }, [user]);

  const addProperty = async (newProp: Omit<Property, 'id' | 'createdAt' | 'slug'>) => {
    const id = `EGP-${Math.floor(100 + Math.random() * 900)}`;
    const slug = newProp.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const createdAt = new Date().toISOString().split('T')[0];
    const property: Property = { ...newProp, id, slug, createdAt };

    setProperties((prev) => [property, ...prev]);

    try {
      await setDoc(doc(db, 'properties', id), property);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `properties/${id}`);
    }
  };

  const updateProperty = async (updatedProperty: Property) => {
    const slug = updatedProperty.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const propWithSlug: Property = { ...updatedProperty, slug };

    setProperties((prev) => prev.map((p) => (p.id === propWithSlug.id ? propWithSlug : p)));

    try {
      await setDoc(doc(db, 'properties', propWithSlug.id), propWithSlug);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `properties/${propWithSlug.id}`);
    }
  };

  const deleteProperty = async (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteDoc(doc(db, 'properties', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `properties/${id}`);
    }
  };

  const addDevelopment = async (newDev: Omit<DevelopmentProject, 'id'>) => {
    const id = `DEV-${Math.floor(10 + Math.random() * 90)}`;
    const development: DevelopmentProject = { ...newDev, id };
    setDevelopments((prev) => [development, ...prev]);

    try {
      await setDoc(doc(db, 'developments', id), development);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `developments/${id}`);
    }
  };

  const updateDevelopment = async (updatedDev: DevelopmentProject) => {
    setDevelopments((prev) => prev.map((d) => (d.id === updatedDev.id ? updatedDev : d)));

    try {
      await setDoc(doc(db, 'developments', updatedDev.id), updatedDev);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `developments/${updatedDev.id}`);
    }
  };

  const deleteDevelopment = async (id: string) => {
    setDevelopments((prev) => prev.filter((d) => d.id !== id));

    try {
      await deleteDoc(doc(db, 'developments', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `developments/${id}`);
    }
  };

  const addService = async (newService: Omit<ServiceItem, 'id'>) => {
    const id = newService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const service: ServiceItem = { ...newService, id };
    setServices((prev) => [...prev, service]);

    try {
      await setDoc(doc(db, 'servicesCatalog', id), service);
    } catch (error) {
      console.warn('Saved service locally; Firestore sync skipped or restricted:', error);
    }
  };

  const updateService = async (updatedService: ServiceItem) => {
    setServices((prev) => prev.map((s) => (s.id === updatedService.id ? updatedService : s)));

    try {
      await setDoc(doc(db, 'servicesCatalog', updatedService.id), updatedService);
    } catch (error) {
      console.warn('Updated service locally; Firestore sync skipped or restricted:', error);
    }
  };

  const deleteService = async (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));

    try {
      await deleteDoc(doc(db, 'servicesCatalog', id));
    } catch (error) {
      console.warn('Deleted service locally; Firestore sync skipped or restricted:', error);
    }
  };

  const addCoOwnershipAsset = async (newAsset: Omit<CoOwnershipAsset, 'id'>) => {
    const id = `EGP-CO-${Math.floor(10 + Math.random() * 90)}`;
    const asset: CoOwnershipAsset = { ...newAsset, id };
    setCoOwnershipAssets((prev) => [asset, ...prev]);

    try {
      await setDoc(doc(db, 'coOwnershipCatalog', id), asset);
    } catch (error) {
      console.warn('Saved co-ownership asset locally; Firestore sync skipped or restricted:', error);
    }
  };

  const updateCoOwnershipAsset = async (updatedAsset: CoOwnershipAsset) => {
    setCoOwnershipAssets((prev) => prev.map((a) => (a.id === updatedAsset.id ? updatedAsset : a)));

    try {
      await setDoc(doc(db, 'coOwnershipCatalog', updatedAsset.id), updatedAsset);
    } catch (error) {
      console.warn('Updated co-ownership asset locally; Firestore sync skipped or restricted:', error);
    }
  };

  const deleteCoOwnershipAsset = async (id: string) => {
    setCoOwnershipAssets((prev) => prev.filter((a) => a.id !== id));

    try {
      await deleteDoc(doc(db, 'coOwnershipCatalog', id));
    } catch (error) {
      console.warn('Deleted co-ownership asset locally; Firestore sync skipped or restricted:', error);
    }
  };

  const updateSiteConfig = async (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);

    try {
      await setDoc(doc(db, 'siteSettings', 'main'), newConfig);
    } catch (error) {
      console.warn('Saved siteConfig locally; Firestore sync skipped or restricted:', error);
    }
  };

  const addBooking = async (newBooking: Omit<InspectionBooking, 'id' | 'createdAt' | 'status'>) => {
    const id = `INSP-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toISOString();
    const booking: InspectionBooking = { ...newBooking, id, createdAt, status: 'Pending' };

    const cleanBooking = Object.fromEntries(
      Object.entries(booking).filter(([_, v]) => v !== undefined)
    );

    setBookings((prev) => [booking, ...prev]);

    try {
      await setDoc(doc(db, 'bookings', id), cleanBooking);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `bookings/${id}`);
    }
  };

  const updateBookingStatus = async (id: string, status: InspectionBooking['status']) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));

    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;
    try {
      await setDoc(doc(db, 'bookings', id), { ...booking, status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    }
  };

  const addInquiry = async (newInquiry: Omit<ContactInquiry, 'id' | 'createdAt'>) => {
    const id = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toISOString();
    const inquiry: ContactInquiry = { ...newInquiry, id, createdAt };

    const cleanInquiry = Object.fromEntries(
      Object.entries(inquiry).filter(([_, v]) => v !== undefined)
    );

    setInquiries((prev) => [inquiry, ...prev]);

    try {
      await setDoc(doc(db, 'inquiries', id), cleanInquiry);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `inquiries/${id}`);
    }
  };

  const resetDemoData = async () => {
    setProperties(INITIAL_PROPERTIES);
    setDevelopments(INITIAL_DEVELOPMENTS);
    setServices(CORE_SERVICES);
    setCoOwnershipAssets(CO_OWNERSHIP_ASSETS);
    setSiteConfig(DEFAULT_SITE_CONFIG);
    setBookings([]);
    setInquiries([]);

    if (!user) return;
    try {
      const batch = writeBatch(db);

      const propsSnap = await getDocs(collection(db, 'properties'));
      propsSnap.forEach((d) => batch.delete(d.ref));

      const devsSnap = await getDocs(collection(db, 'developments'));
      devsSnap.forEach((d) => batch.delete(d.ref));

      const bksSnap = await getDocs(collection(db, 'bookings'));
      bksSnap.forEach((d) => batch.delete(d.ref));

      const inqsSnap = await getDocs(collection(db, 'inquiries'));
      inqsSnap.forEach((d) => batch.delete(d.ref));

      INITIAL_PROPERTIES.forEach((prop) => {
        batch.set(doc(db, 'properties', prop.id), prop);
      });

      INITIAL_DEVELOPMENTS.forEach((dev) => {
        batch.set(doc(db, 'developments', dev.id), dev);
      });

      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'resetDemoData');
    }
  };

  const openInspectionModal = (property?: { id: string; title: string }) => {
    setSelectedPropertyForInspection(property || null);
    setIsInspectionModalOpen(true);
  };

  const closeInspectionModal = () => {
    setIsInspectionModalOpen(false);
    setSelectedPropertyForInspection(null);
  };

  return (
    <DataContext.Provider
      value={{
        properties,
        developments,
        services,
        coOwnershipAssets,
        siteConfig,
        bookings,
        inquiries,
        addProperty,
        updateProperty,
        deleteProperty,
        addDevelopment,
        updateDevelopment,
        deleteDevelopment,
        addService,
        updateService,
        deleteService,
        addCoOwnershipAsset,
        updateCoOwnershipAsset,
        deleteCoOwnershipAsset,
        updateSiteConfig,
        addBooking,
        updateBookingStatus,
        addInquiry,
        resetDemoData,
        isInspectionModalOpen,
        selectedPropertyForInspection,
        openInspectionModal,
        closeInspectionModal,
        user,
        isAuthReady,
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
