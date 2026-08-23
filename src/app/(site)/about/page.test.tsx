import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import About from './page'

test('About Page renders headings', () => {
  render(<About />)
  expect(screen.getAllByText('About Me').length).toBeGreaterThan(0)
  expect(screen.getByRole('heading', { name: 'The mission path.' })).toBeDefined()
  expect(screen.getByRole('heading', { name: 'Capabilities' })).toBeDefined()
})

test('About Page renders founder and veteran narrative', () => {
  render(<About />)
  expect(screen.getByText('Veteran founder building practical software')).toBeDefined()
  expect(screen.getByText(/military veteran, full-stack engineer/i)).toBeDefined()
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
  expect(screen.getByText(/Client web, local AI products/i)).toBeDefined()
  expect(screen.getByText('Mission clarity')).toBeDefined()
  expect(screen.getByText('Delivery discipline')).toBeDefined()
  expect(screen.getByText('Owner-level judgment')).toBeDefined()
})
