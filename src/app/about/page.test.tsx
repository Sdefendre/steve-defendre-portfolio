import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import About from './page'

test('About Page renders headings', () => {
  render(<About />)
  expect(screen.getAllByText('About Me').length).toBeGreaterThan(0)
  expect(screen.getByText('Core Values')).toBeDefined()
  expect(screen.getByText('Skills')).toBeDefined()
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

test('About Page renders core values', () => {
  render(<About />)
  expect(screen.getByText('Military Foundation')).toBeDefined()
  expect(screen.getByText('Builder')).toBeDefined()
  expect(screen.getByText('Consultant')).toBeDefined()
})
