import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
import { chromium } from 'playwright';

const output = join(process.cwd(), 'public', 'downloads');
await mkdir(output, { recursive: true });

const profile = {
  name: 'Carlos Emmanuel Mendiola Miranda',
  contact: 'Rayón, State of Mexico · carlosmir.code@gmail.com · +52 55 6427 7752',
  sections: [
    {
      title: 'Education',
      entries: [
        {
          heading: 'Hybridge · Online',
          meta: 'Currently enrolled',
          body: ['Concurrently pursuing Software Engineering and Artificial Intelligence Engineering degrees.'],
        },
        {
          heading: 'CBT San Pedro Tlaltizapan · Tianguistenco, State of Mexico',
          meta: 'Graduated July 16, 2026',
          body: [
            'Passed the professional examination unanimously and with honors.',
            'Developed and deployed structured and object-oriented web and mobile applications with persistent storage, including e-learning and e-commerce platform administration.',
          ],
        },
      ],
    },
    {
      title: 'Experience',
      entries: [
        {
          heading: 'FER&REN · Part-time DevOps Consultant',
          meta: 'January 2026 – July 2026 · Toluca, State of Mexico',
          body: [
            'Established self-hosted high-availability infrastructure with Dokploy, Directus, PostgreSQL, Patroni, and etcd after a cloud-region outage left five Flutter applications unavailable.',
            'Configured a three-node topology across a VPS, a homelab connected through Cloudflare Tunnel, and an iMac, keeping two active nodes available to remove a single point of failure.',
            'Installed and secured Debian 13 servers with Tailscale, SSH, and Bash automation for remote administration.',
            'Deployed a custom Go monitoring agent for real-time infrastructure supervision.',
            'Migrated the existing Flutter applications to Astro, Preact, and Tailwind CSS, then added vehicle inspection, service control, personnel, finance, and PPF installation checklist applications.',
            'Maintained and expanded ten production applications as operational needs evolved.',
          ],
        },
        {
          heading: 'FER&REN · Systems Developer',
          meta: 'July 2025 – December 2025 · Metepec, State of Mexico',
          body: [
            'Implemented five cross-platform Flutter applications for attendance, PPF quoting, PPF inventory, sales records, and studio income, backed by Supabase.',
            'Digitized core workflows and configured the data models and business logic around real operational processes.',
            'Maintained and supported the applications in production.',
          ],
        },
      ],
    },
    {
      title: 'Leadership & Activities',
      entries: [
        {
          heading: '2 Free · Open-source Personal Finance Application',
          meta: 'Developer',
          body: [
            'Designed local, self-hosted, and cloud-managed operating modes.',
            'Built a NestJS and Prisma backend, a React/Next.js web application, and shared authentication with Better Auth.',
            'Created an Astro landing site and reference Docker Compose deployment for self-hosting.',
            'Built Linux and Android applications with Tauri, Rust, SQLCipher, and native secure key storage so the product can operate fully offline.',
          ],
        },
        {
          heading: 'Public Center for Artificial Intelligence Training · Preparatory MOOC',
          meta: 'Certified',
          body: [
            'Completed evaluated modules in networking, cloud computing, cybersecurity, Java, artificial intelligence, and data analysis.',
          ],
        },
      ],
    },
    {
      title: 'Skills & Interests',
      entries: [
        {
          heading: 'Technical',
          meta: '',
          body: [
            'JavaScript, TypeScript, Go, Flutter, Astro, Tailwind CSS, NestJS, Prisma, Better Auth, React, Next.js, Preact, Tauri, Rust, SQLite, PostgreSQL, Docker, SSH, Bash, Linux, Android Studio, Git, Vitest, Playwright',
          ],
        },
        { heading: 'Languages', meta: '', body: ['Spanish (native), English (A2)'] },
        {
          heading: 'Interests',
          meta: '',
          body: ['High-fidelity audio, video games, desktop and window-manager customization, free software, personal finance, and self-hosting.'],
        },
      ],
    },
  ],
};

const headingRow = (heading, meta) => new Paragraph({
  keepNext: true,
  children: [
    new TextRun({ text: heading, bold: true, size: 21 }),
    ...(meta ? [new TextRun({ text: `  ·  ${meta}`, color: '555555', size: 18 })] : []),
  ],
  spacing: { before: 110, after: 35 },
});

const docChildren = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: profile.name, bold: true, size: 34 })],
    spacing: { after: 45 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: 'Rayón, State of Mexico · ' }),
      new ExternalHyperlink({
        link: 'mailto:carlosmir.code@gmail.com',
        children: [new TextRun({ text: 'carlosmir.code@gmail.com', style: 'Hyperlink' })],
      }),
      new TextRun({ text: ' · +52 55 6427 7752' }),
    ],
    border: { bottom: { color: 'B7B7B7', size: 5, style: BorderStyle.SINGLE, space: 8 } },
    spacing: { after: 100 },
  }),
];

for (const section of profile.sections) {
  docChildren.push(new Paragraph({ text: section.title, heading: HeadingLevel.HEADING_1, keepNext: true }));
  for (const entry of section.entries) {
    docChildren.push(headingRow(entry.heading, entry.meta));
    for (const item of entry.body) {
      docChildren.push(new Paragraph({
        text: item,
        bullet: entry.body.length > 1 || section.title === 'Experience' || section.title === 'Leadership & Activities' ? { level: 0 } : undefined,
        spacing: { after: 48 },
      }));
    }
  }
}

const document = new Document({
  creator: 'Carlos Miranda',
  title: 'Carlos Miranda Resume',
  description: 'English resume for Carlos Miranda',
  styles: {
    default: { document: { run: { font: 'Calibri', size: 19 }, paragraph: { spacing: { line: 242 } } } },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { bold: true, size: 25, color: '111111' },
        paragraph: {
          spacing: { before: 150, after: 35 },
          border: { bottom: { color: '888888', size: 4, style: BorderStyle.SINGLE, space: 2 } },
        },
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 540, right: 660, bottom: 540, left: 660 },
      },
    },
    children: docChildren,
  }],
});

const docxBuffer = await Packer.toBuffer(document);
await writeFile(join(output, 'Carlos-Miranda-CV-en.docx'), docxBuffer);

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const renderResumeHtml = (resume, language) => {
  const htmlSections = resume.sections.map((section) => `
  <section>
    <h2>${escapeHtml(section.title)}</h2>
    ${section.entries.map((entry) => `
      <article>
        <header><h3>${escapeHtml(entry.heading)}</h3>${entry.meta ? `<span>${escapeHtml(entry.meta)}</span>` : ''}</header>
        ${entry.body.length > 1
          ? `<ul>${entry.body.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
          : `<p>${escapeHtml(entry.body[0])}</p>`}
      </article>`).join('')}
  </section>`).join('');

  return `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><style>
  @page { size: Letter; margin: 0.55in 0.62in; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #111; font-family: "DejaVu Sans Condensed", Arial, sans-serif; font-size: 10pt; line-height: 1.17; }
  h1 { margin: 0 0 3px; text-align: center; font-size: 18pt; }
  .contact { margin: 0 0 9px; padding-bottom: 7px; border-bottom: 1px solid #777; text-align: center; font-size: 8.7pt; white-space: nowrap; }
  section { break-inside: auto; }
  h2 { margin: 9px 0 4px; border-bottom: 1px solid #777; font-size: 12pt; line-height: 1.1; }
  article { break-inside: avoid; margin: 0 0 5px; }
  article header { display: block; }
  h3 { margin: 2px 0; font-size: 10.3pt; }
  article header span { display: block; color: #444; font-size: 8.8pt; }
  p, ul { margin: 2px 0 4px; }
  ul { padding-left: 15px; }
  li { margin-bottom: 1.5px; }
</style></head><body><h1>${escapeHtml(resume.name)}</h1><p class="contact">${escapeHtml(resume.contact)}</p>${htmlSections}</body></html>`;
};

const html = renderResumeHtml(profile, 'en');

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({
    path: join(output, 'Carlos-Miranda-CV-en.pdf'),
    format: 'Letter',
    margin: { top: '0.55in', right: '0.62in', bottom: '0.55in', left: '0.62in' },
    printBackground: true,
    tagged: true,
  });
} finally {
  await browser.close();
}

console.log('Generated the English DOCX and tagged PDF in public/downloads.');
