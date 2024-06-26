import { expect, test } from './test'

test('uses the operation summary for title', async ({ docPage }) => {
  await docPage.goto('/v3/petstore-simple/operations/listpets/')

  await docPage.expectToHaveTitle('List all pets')
})

test('falls back to the operation ID for title', async ({ docPage }) => {
  await docPage.goto('/petstore/operations/findpets/')

  await docPage.expectToHaveTitle('findPets')
})

test('displays basic informations', async ({ docPage }) => {
  await docPage.goto('/v3/animals/operations/listanimals/')

  await expect(docPage.getByText('Deprecated', { exact: true })).toBeVisible()

  await expect(docPage.getByText('GET', { exact: true })).toBeVisible()
  await expect(docPage.getByText('/animals')).toBeVisible()

  await expect(docPage.getByText('Returns all animals')).toBeVisible()

  const externalDocsLink = docPage.getByRole('link', { name: 'Find out more about our animals' })
  await expect(externalDocsLink).toBeVisible()
  expect(await externalDocsLink.getAttribute('href')).toBe('https://example.com/more-info')
})

test('displays the operation URL for a v2.0 schema', async ({ docPage }) => {
  await docPage.goto('/v2/animals/operations/findanimals/')

  await docPage.getOperation().click()

  expect(await docPage.getOperation().getByRole('textbox').inputValue()).toBe('example.com/api/animals')
})

test('displays the operation URLs for a v3.0 schema', async ({ docPage }) => {
  await docPage.goto('/v3/animals/operations/listdogs/')

  await docPage.getOperation().click()

  await expect(docPage.getOperation().getByText('Default server')).toBeVisible()
  expect(await docPage.getOperation().getByRole('textbox').first().inputValue()).toBe('example.com/api/dogs')
  await expect(docPage.getOperation().getByText('Sandbox server')).toBeVisible()
  expect(await docPage.getOperation().getByRole('textbox').last().inputValue()).toBe('sandbox.example.com/api/dogs')
})

test('displays overriden operation URLs for a v3.0 schema', async ({ docPage }) => {
  await docPage.goto('/v3/animals/operations/listbears/')

  await docPage.getOperation().click()

  await expect(docPage.getOperation().getByText('Custom server')).toBeVisible()
  expect(await docPage.getOperation().getByRole('textbox').inputValue()).toBe('custom.example.com/api/bears')
})

test('generates multiple pages for operations with identical IDs but different methods', async ({ docPage }) => {
  await docPage.goto('/v3/animals/operations/turtles/get')

  await docPage.expectToHaveTitle('List all turtles')

  await docPage.goto('/v3/animals/operations/turtles/post')

  await docPage.expectToHaveTitle('/turtles (POST)')
})
