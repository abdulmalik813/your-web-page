import React from 'react';

export const MapSection: React.FC = () => {
  const address = "44 Beach Grove Rd Unit 3, Charlottetown, PE C1E 1Y5";
  const phone = "902-629-9691";
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section className="w-full border border-[#000000] bg-[#faf9f9] my-12 overflow-hidden shadow-lg">
      {/* Top Banner */}
      <div className="bg-[#000000] text-white p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#000000]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff4500] text-white font-mono-metric text-xs font-bold uppercase mb-3">
            <span>☕</span>
            <span>CHARLOTTETOWN HOME LOCATION</span>
          </div>
          <h2 className="font-headline-lg text-3xl sm:text-5xl text-white uppercase tracking-tight">
            VISITS BY APPOINTMENT ONLY
          </h2>
          <p className="font-body-md text-sm text-white/80 max-w-2xl mt-2">
            Please call ahead or send us a message to arrange an in-person meeting.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className="btn-primary bg-[#ff4500] border-[#ff4500] text-white hover:bg-white hover:text-[#000000] text-xs px-6 py-3.5 inline-flex items-center gap-2 cursor-pointer font-bold w-full sm:w-auto"
          >
            <span className="material-symbols-outlined text-lg">call</span>
            CALL {phone}
          </a>
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-white border-white hover:bg-white hover:text-[#000000] text-xs px-6 py-3.5 inline-flex items-center gap-2 cursor-pointer font-bold w-full sm:w-auto"
          >
            <span className="material-symbols-outlined text-lg">directions</span>
            GET DIRECTIONS
          </a>
        </div>
      </div>

      {/* Grid with Details and Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Contact Details Card */}
        <div className="lg:col-span-5 p-8 border-b lg:border-b-0 lg:border-r border-[#000000] bg-[#f4f3f3] flex flex-col justify-between space-y-8">
          <div className="space-y-6 font-mono-metric text-sm">
            <div>
              <span className="text-[#ff4500] text-xs font-bold block uppercase mb-1">
                HOME LOCATION
              </span>
              <p className="font-headline-md text-2xl text-[#000000] leading-tight">
                44 Beach Grove Rd, Unit 3<br />
                Charlottetown, PE C1E 1Y5<br />
                Canada
              </p>
            </div>

            <div className="border-t border-[#c4c7c7] pt-4">
              <span className="text-[#ff4500] text-xs font-bold block uppercase mb-1">
                [DIRECT PHONE]
              </span>
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="font-headline-md text-3xl text-[#000000] hover:text-[#ff4500] transition-colors block"
              >
                902-629-9691
              </a>
            </div>

            <div className="border-t border-[#c4c7c7] pt-4">
              <span className="text-[#ff4500] text-xs font-bold block uppercase mb-1">
                MEETINGS
              </span>
              <p className="font-body-md text-xs text-[#444748] leading-relaxed">
                In-person meetings are available by appointment only. We do not accept walk-ins.
              </p>
            </div>
          </div>

        </div>

        {/* Map Embed Column */}
        <div className="lg:col-span-7 h-[380px] lg:h-auto min-h-[350px] relative bg-[#e2e2e2]">
          <iframe
            title="Home Location Map - 44 Beach Grove Rd Unit 3 Charlottetown PEI"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'contrast(1.05) grayscale(0.2)' }}
            loading="lazy"
            allowFullScreen
            src={mapEmbedUrl}
            className="w-full h-full min-h-[350px]"
          ></iframe>

          {/* Floating Overlay Badge */}
          <div className="absolute bottom-4 left-4 bg-[#000000] text-white p-3 border border-[#000000] shadow-md font-mono-metric text-xs uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#ff4500] rounded-full animate-ping"></span>
            <span>44 BEACH GROVE RD UNIT 3 // CHARLOTTETOWN</span>
          </div>
        </div>
      </div>
    </section>
  );
};
