import express from 'express'
import User from '../app/Models/User'
import Post from '../app/Models/Message'

const router = express.Router()
const routerUser = express.Router()
const routerPost = express.Router()

routerUser.get('/', async function (req, res) {
  const users = await User.findOne({ _id: '64290f30bb3798c7e7e07f32' })
  res.send(users)
})

routerUser.get('/ins', async (req, res) => {
  const users = new User({
    first_name: 'nam',
    last_name: 'Nguy',
    email: 'namnguy@gmail.com',
    birthdate: Date.now(),
    gender: '1',
  })
  await users.save()
  res.send(users)
})

routerUser.get('/restore', async (req, res) => {
  const usersDeleted = await User.findDeleted({ last_name: 'Nguyễn' })
  const user = usersDeleted[0]
  await User.restore({ _id: user._id }, { timestamps: false })
  res.send(user)
})

routerUser.get('/del', async (req, res) => {
  const user = await User.findOne({ last_name: 'Nguyễn' })
  await user.delete('6427f8ace68a0d5aabc4791b', { timestamps: false })
  res.send(user)
})

routerPost.get('/', async (req, res) => {
  const posts = await Post.find()
  res.send(posts)
})

routerPost.get('/ins', async (req, res) => {
  const post = new Post({
    content: 'abcdef',
    user_id: '6427fd9aaac1383b63dff428',
    status: '1',
  })
  await post.save()
  res.send(post)
})

routerPost.get('/del', async (req, res) => {
  const user = await Post.findOne({ _id: '6428b32955863523ab008457' })
  await user.delete('6427f8ace68a0d5aabc4791d', { timestamps: false })
  res.send(user)
})

routerPost.get('/res', async (req, res) => {
  await Post.restore({ _id: '6428b32955863523ab008457' })
  res.redirect('/post')
})
router.use('/user', routerUser)

router.use('/post', routerPost)

export default router
