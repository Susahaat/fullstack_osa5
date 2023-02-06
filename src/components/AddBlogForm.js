import { useState } from 'react'
import propTypes from 'prop-types'

const AddBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleAddNew = () => {
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleTitleChange = (event) => {
    event.preventDefault()
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    event.preventDefault()
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    event.preventDefault()
    setUrl(event.target.value)
  }

  return (
    <div>
      <h2>lisää uusi</h2>
      <form onSubmit={handleAddNew}>
        <div>
            Nimi:
          <input type="text" value={title} name="Title" onChange={handleTitleChange}/>
        </div>
        <div>
            Kirjoittaja:
          <input type="text" value={author} name="Author" onChange={handleAuthorChange}/>
        </div>
        <div>
            Url:
          <input type="text" value={url} name="Url" onChange={handleUrlChange}/>
        </div>
        <button type="submit">Lisää</button>
      </form>
    </div>
  )
}

AddBlogForm.propTypes = {
  createBlog: propTypes.func.isRequired
}

export default AddBlogForm