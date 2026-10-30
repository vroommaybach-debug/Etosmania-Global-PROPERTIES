import React from 'react';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/development/ProjectCard';
import { SectionHeading } from '../components/common/SectionHeading';

export const DevelopmentsPage: React.FC = () => {
  const { developments } = useData();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <section className="bg-[#07142B] text-white py-16 lg:py-20 border-b-4 border-[#FACC15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-[#07142B] font-mono-tech text-xs font-extrabold uppercase tracking-widest mb-3">
            Sustainable Community-Centered Estates
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight">
            Signature Estate Developments by Etosmania
          </h1>
          <p className="text-blue-100/85 text-base sm:text-lg max-w-2xl mt-3">
            In alignment with our Vision to become Nigeria&apos;s most trusted and innovative real
            estate developer, explore our master-planned residential and land estates across Ajah, Lekki, Egbeda, Akowonjo, Agbara, and Ibeju-Lekki.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <SectionHeading
          subtitle="Master-Planned Communities"
          title="Ongoing & Completed Developments."
          description="Available for outright acquisition, milestone installment plans, or fractional co-ownership."
        />

        <div className="space-y-8">
          {developments.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};
