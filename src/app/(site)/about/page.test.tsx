import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import About, { metadata } from './page'

test('About Page renders headings', () => {
  render(<About />)
  expect(screen.getAllByText('About me').length).toBeGreaterThan(0)
  expect(screen.getByRole('heading', { name: 'How I take a project.' })).toBeDefined()
  expect(screen.getByRole('heading', { name: 'What I use' })).toBeDefined()
})

test('About Page renders founder and veteran narrative', () => {
  render(<About />)
  expect(screen.getByText('Veteran, CS graduate, product engineer')).toBeDefined()
  expect(screen.getByText(/military veteran, CS graduate/i)).toBeDefined()
  expect(screen.getByRole('link', { name: 'Defendre Solutions (opens in a new tab)' })).toHaveAttribute(
    'href',
    'https://defendresolutions.com'
  )
})

test('About Page renders skills', () => {
  render(<About />)
  const skills = [
    "React", "Next.js", "TypeScript", "Node.js",
    "PostgreSQL", "AWS", "Docker", "Python",
    "Tailwind CSS", "GraphQL", "REST APIs", "Git"
  ]
  skills.forEach(skill => {
    expect(screen.getByText(skill)).toBeDefined()
  })
})

test('About Page renders proof points and operating principles', () => {
  render(<About />)
  expect(screen.getByText('Founder of Defendre Solutions')).toBeDefined()
  expect(screen.getByText(/Client sites, local AI tools/i)).toBeDefined()
  expect(screen.getByText('Start with the outcome')).toBeDefined()
  expect(screen.getByText('Ship the next usable version')).toBeDefined()
  expect(screen.getByText('Own it after launch')).toBeDefined()
})

test('About Page preserves shared Open Graph metadata', () => {
  expect(metadata.alternates?.canonical).toBe('/about')
  expect(metadata.openGraph).toMatchObject({
    type: 'website',
    locale: 'en_US',
    url: '/about',
    siteName: 'Steve Defendre Portfolio',
    images: [{ url: '/project-previews/defendre-solutions.jpg' }],
  })
  expect(metadata.twitter).toMatchObject({
    title: 'About Steve Defendre | Veteran software builder',
    images: [
      {
        url: '/project-previews/defendre-solutions.jpg',
        alt: 'Steve Defendre portfolio preview',
      },
    ],
  })
})
