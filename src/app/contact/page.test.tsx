import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Contact from './page'

test('renders Contact page with heading and introductory text', () => {
  render(<Contact />)
  expect(screen.getByRole('heading', { name: /Get in Touch/i })).toBeTruthy()
  expect(screen.getByText(/Have a project in mind\? I'd love to hear from you\./i)).toBeTruthy()
})

test('renders all contact links with correct hrefs', () => {
  render(<Contact />)

  // Use a matcher that is less sensitive to nested text to reduce coupling to full accessible name.
  const emailLink = screen.getByRole('link', { name: (n) => n.includes('Email') })
  expect(emailLink.getAttribute('href')).toBe('mailto:steve.defendre12@gmail.com')

  const linkedinLink = screen.getByRole('link', { name: (n) => n.includes('LinkedIn') })
  expect(linkedinLink.getAttribute('href')).toBe('https://www.linkedin.com/in/joseph-m-defendre-a11a47225/')

  const githubLink = screen.getByRole('link', { name: (n) => n.includes('GitHub') })
  expect(githubLink.getAttribute('href')).toBe('https://github.com/Sdefendre')

  const supportLink = screen.getByRole('link', { name: (n) => n.includes('Support') })
  expect(supportLink.getAttribute('href')).toBe('https://buymeacoffee.com/defendresolutions')
})

test('renders business info section correctly', () => {
  render(<Contact />)
  expect(screen.getByText('Defendre Solutions')).toBeTruthy()
  expect(screen.getByText(/Veteran-owned software development/i)).toBeTruthy()
  expect(screen.getByText(/Available for new projects/i)).toBeTruthy()
})
