'use client';

import Link from 'next/link';

const services = [
  { name: 'Generate', path: '/ai_generate', icon: '🎨' },
  { name: 'Upscale', path: '/ai_upscale', icon: '⬆️' },
  { name: 'Colorize', path: '#', icon: '🎨' },
  { name: 'Extract', path: '#', icon: '✂️' },
  { name: 'Outpaint', path: '#', icon: '🖼️' },
  { name: 'Animate', path: '#', icon: '🎬' }
];

export default function Home() {
  return (
    <div className="container max-w-4xl mx-auto p-5">
      <h1 className="text-4xl font-bold text-center my-10 text-white">RepNext</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <Link 
            key={service.name} 
            href={service.path}
            className={`p-6 rounded-lg shadow-lg bg-gray-800 hover:shadow-xl transition-shadow
              flex flex-col items-center justify-center space-y-2
              ${service.path === '#' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transform transition-transform'}`}
            onClick={e => service.path === '#' && e.preventDefault()}
          >
            <span className="text-4xl">{service.icon}</span>
            <span className="text-lg font-semibold text-white">{service.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}