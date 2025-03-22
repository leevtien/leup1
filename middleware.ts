// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

// Initialize Firebase Admin if not already initialized
const apps = getApps()
if (!apps.length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  })
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value || ''
  
  // If no session cookie, redirect to login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/account/login', request.url))
  }
  
  try {
    // Verify the session cookie
    const decodedClaim = await getAuth().verifySessionCookie(sessionCookie)
    const uid = decodedClaim.uid
    
    // Check if user is admin
    const db = getFirestore()
    const userDoc = await db.collection('users').doc(uid).get()
    
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      // Not an admin, redirect to home
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Admin user, allow access
    return NextResponse.next()
  } catch (error) {
    // Invalid session cookie
    return NextResponse.redirect(new URL('/account/login', request.url))
  }
}

// Only run middleware on admin routes
export const config = {
  matcher: '/admin/:path*',
}