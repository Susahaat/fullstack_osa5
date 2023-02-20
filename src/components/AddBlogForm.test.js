import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddBlogForm from './AddBlogForm'

test('blogin luominen', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  const { container } = render(<AddBlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')
  const submitButton = screen.getByText('Lisää')

  await user.type(titleInput, 'Bloginimi')
  await user.type(authorInput, 'Susanna Haataja')
  await user.type(urlInput, 'www.testinen')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Bloginimi')
  expect(createBlog.mock.calls[0][0].author).toBe('Susanna Haataja')
  expect(createBlog.mock.calls[0][0].url).toBe('www.testinen')
})