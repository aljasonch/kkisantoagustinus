# KKI Paroki Karawaci Website

The official website of **Komunitas Kerahiman Ilahi (KKI) — Santo Agustinus Church, Karawaci Parish, Tangerang**, with the motto _"Jesus, I Trust in You"_.

The website serves as the community's information hub, featuring prayer schedules, the Divine Mercy Chaplet devotion text, daily reflections, activity galleries, and contact information. Administrators can independently update reflections and gallery content through the admin panel.

## Overview

- **Home:** hero section, Today's Reflection, Chairman's welcome message, daily quote from the Diary of Saint Faustina, community prayer schedule, and latest gallery.
- **About:** history of the Divine Mercy devotion, KKI Karawaci community profile, and organizational structure.
- **Devotion & Schedule:** 5 elements of the devotion, complete Divine Mercy Chaplet prayer text, regular and annual schedules.
- **Reflections:** daily reflection archive + detail page for each date (`/renungan/[tanggal]`).
- **Gallery:** photo documentation of community activities.
- **Contact:** church address + map, community contact information, and parish website link.
- **Admin (`/admin`):** administrator login, write/publish reflections (draft & published), and manage gallery photos.

## Technologies

- **Next.js (App Router) + React + TypeScript**
- **Tailwind CSS v4** for styling
- **Firebase Auth + Firestore** for administrator authentication and reflection/gallery data
- **Cloudinary** for gallery photo storage

## Page Structure

| Route | Content |
|---|---|
| `/` | Home |
| `/tentang` | History, community profile, organizational structure |
| `/devosi-jadwal` | Devotion elements, Chaplet prayer text, schedule |
| `/renungan` | Reflection archive |
| `/renungan/[tanggal]` | Daily reflection details |
| `/galeri` | Activity gallery |
| `/kontak` | Contact information, address, map |
| `/admin` | Administrator panel (reflections + gallery) |
