import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renderöi titlen', () => {
  const blog = {
    user: {
      name: 'testi',
      username: 'testinen',
      id: 'asgmianfwa8746848agawge'
    },
    title: 'Blog title',
    author: 'Author',
    likes: 5,
    url: 'testi.url',
    id: 'dagawgrdb56668ageag'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Blog title Author')
  expect(element).toBeDefined()
})

test('kaikki tiedot näytetään, kun nappia painetaan', async () => {
  const blog = {
    user: {
      name: 'testi',
      username: 'testinen',
      id: 'asgmianfwa8746848agawge'
    },
    title: 'Blog title',
    author: 'testi',
    likes: 5,
    url: 'testi.url',
    id: 'dagawgrdb56668ageag'
  }

  const userData = {
    name: 'testi',
    username: 'testinen'
  }

  const { container } = render(<Blog blog={blog} user={userData} />)

  const user = userEvent.setup()
  const button = screen.getByText('näytä')
  await user.click(button)

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent('testi.url')
  expect(div).toHaveTextContent('5')
  expect(div).toHaveTextContent('testi')
})

test('like painettu kahdesti', async () => {
  const blog = {
    user: {
      name: 'testi',
      username: 'testinen',
      id: 'asgmianfwa8746848agawge'
    },
    title: 'Blog title',
    author: 'testi',
    likes: 5,
    url: 'testi.url',
    id: 'dagawgrdb56668ageag'
  }

  const userData = {
    name: 'testi',
    username: 'testinen'
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} user={userData} updateLikes={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('näytä')
  await user.click(button)

  const likeButton = screen.getByText('tykkää')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})