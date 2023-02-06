import { useState } from 'react'

const Blog = ({ blog, updateLikes, user, removeBlogById }) => {
  const blogStyle = {
    paddingTop: 8,
    paddingLeft: 4,
    border: 'solid',
    borderWidth: 2,
    marginBottom: 8
  }

  const [visible, setVisible] = useState(false)

  const updateBlog = () => {
    const updateObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id
    }

    updateLikes(updateObject)
  }

  const removeBlog = () => {
    removeBlogById(blog)
  }

  return (
    <div>
      {visible ? (
        <div style={blogStyle}>{blog.title} {blog.author} <button onClick={() => setVisible(false)}>piilota</button>
          <br/>
          {blog.url}<br/>
          tykkäykset {blog.likes} <button onClick={updateBlog}>tykkää</button><br/>
          {blog.user.name}
          {user.username === blog.user.username && (
            <button onClick={removeBlog}>poista</button>
          )}
        </div> ) : (
        <div style={blogStyle}>{blog.title} {blog.author} <button onClick={() => setVisible(true)}>näytä</button>
        </div>
      )}
    </div>
  )}

export default Blog