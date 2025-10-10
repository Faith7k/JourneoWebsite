import { NextResponse } from 'next/server';

// Bu veriler admin panelinden gelecek, şimdilik static olarak tanımlıyoruz
// Gerçek uygulamada bu veriler bir veritabanından gelecek
let screenshots = [
  {
    id: 1,
    title: 'Welcome Dashboard',
    description: 'Your personal travel hub with AI-powered insights',
    alt: 'Main Screen',
    src: '/images/screenshot-1.png',
    icon: 'Smartphone',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    title: 'Interactive Map',
    description: 'Real-time navigation with smart route suggestions',
    alt: 'Map View',
    src: '/images/screenshot-2.png',
    icon: 'MapPin',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 3,
    title: 'AI Route Planning',
    description: 'Intelligent route optimization for your journey',
    alt: 'Route Planning',
    src: '/images/screenshot-3.png',
    icon: 'Route',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 4,
    title: 'Trip Management',
    description: 'Organize and track your travel experiences',
    alt: 'Travel Details',
    src: '/images/screenshot-4.png',
    icon: 'Calendar',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 5,
    title: 'Smart Packing',
    description: 'AI-powered packing suggestions for your trip',
    alt: 'Smart Suitcase',
    src: '/images/screenshot-5.png',
    icon: 'Briefcase',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 6,
    title: 'Expense Tracking',
    description: 'Keep track of your travel budget effortlessly',
    alt: 'Expenses',
    src: '/images/screenshot-6.png',
    icon: 'Wallet',
    color: 'from-teal-500 to-green-500'
  }
];

export async function GET() {
  return NextResponse.json(screenshots);
}

export async function POST(request: Request) {
  try {
    const newScreenshot = await request.json();
    const id = Math.max(...screenshots.map(s => s.id)) + 1;
    const screenshot = { ...newScreenshot, id };
    screenshots.push(screenshot);
    return NextResponse.json(screenshot, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedScreenshot = await request.json();
    const index = screenshots.findIndex(s => s.id === updatedScreenshot.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Screenshot not found' }, { status: 404 });
    }
    screenshots[index] = updatedScreenshot;
    return NextResponse.json(updatedScreenshot);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    const index = screenshots.findIndex(s => s.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Screenshot not found' }, { status: 404 });
    }
    screenshots.splice(index, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
