import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import AddBlogForm from './components/AddBlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const appStyle = {
    paddingTop: 8,
    paddingLeft: 20,
  }

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [confirmationMessage, setConfirmationMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem( 'loggedBlogappUser', JSON.stringify(user) )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('väärät kirjautumistiedot')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()

      blogService.create(blogObject).then((addedBlog) => {
        setBlogs(blogs.concat(addedBlog))

        setConfirmationMessage(`Uusi blogi lisätty. Kirjoittaja ${blogObject.author}, nimi ${blogObject.title}`)
        setTimeout(() => {
          setConfirmationMessage(null)
        }, 5000)
      })

    } catch (exception) {
      setErrorMessage(`Blogin lisääminen epäonnistui, virhe: virhe: ${exception.response.data.error}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlogForm = () => {
    return (
      <Togglable buttonLabel='Uusi blogi' ref={blogFormRef}>
        <AddBlogForm createBlog={addBlog}/>
      </Togglable>
    )
  }

  const updateLikes = (blog) => {
    const updateObject = {
      user: blog.user,
      likes: blog.likes,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    try {
      blogService.update(blog.id, updateObject).then((result) => {
        const updatedBlogs = blogs.map(object => {
          if(blog.id === object.id) {
            object.likes = updateObject.likes
            return object
          } else {
            return object
          }
        })

        setBlogs(updatedBlogs)
        setConfirmationMessage(`Tykkäys lisätty blogille ${result.title}`)
        setTimeout(() => {
          setConfirmationMessage(null)
        }, 5000)
      })
    } catch (exception) {
      setErrorMessage(`Tykkäyksen lisääminen epäonnistui, virhe: ${exception.response.data.error}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlogById = (blog) => {
    if(window.confirm(`Poista blogi ${blog.title}, kirjoittaja ${blog.author}`)) {
      blogService.remove(blog.id).then(() => {
        const blogsAfter = blogs.filter(object => object.id !== blog.id)
        setBlogs(blogsAfter)
        setConfirmationMessage('Blogi poistettu')
        setTimeout(() => {
          setConfirmationMessage(null)
        }, 5000)
      }).catch((error) => {
        setErrorMessage(`Blogin poistaminen epäonnistui, virhe: ${error.response.data.error}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    }
  }

  const ErrorNotification = ({ message }) => {
    if (message === null) {
      return null
    }

    return <div className="error">{message}</div>
  }

  const OkNotification = ({ message }) => {
    if (message === null) {
      return null
    }

    return <div className="confirmation">{message}</div>
  }

  if (user === null) {
    return (
      <div>
        <h2>Kirjaudu sisään sovellukseen</h2>
        <OkNotification message={confirmationMessage} />
        <ErrorNotification message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            Käyttäjänimi
            <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
            Salasana
            <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button type="submit">Kirjaudu</button>
        </form>
      </div>
    )
  }

  return (
    <div style={appStyle}>
      <div>
        <h2>Blogit</h2>
        <OkNotification message={confirmationMessage} />
        <ErrorNotification message={errorMessage} />
        <p>{user.name} on kirjautuneena <button onClick={handleLogout}>Kirjaudu ulos</button></p>
      </div>
      <div>
        {addBlogForm()}
      </div>
      <div>
        {blogs.sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog key={blog.id} blog={blog} updateLikes={updateLikes} user={user} removeBlogById={removeBlogById}/>
          )}
      </div>
    </div>
  )
}

export default App
