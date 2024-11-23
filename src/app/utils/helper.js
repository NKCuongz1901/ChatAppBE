import CloudinaryConfig from '@/config/Cloudinary'
import sendMail from '@/config/SendMail'

export const getUserResult = (user) => ({
  _id: user._id,
  email: user.email,
  fullName: user.fullName,
  avatar: user.avatar,
  gender: user.gender,
  birthdate: user.birthdate,
})

export const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000)
}

export const sendResetPasswordMail = (auth, code) => {
  console.log(auth)
  const html = `
      <div class="container" style="background-color: #fff;
            border-radius: 5px;
            padding: 20px;
            margin: 50px auto;
            max-width: 500px;
            text-align: center;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);">
        <h1 style="
                color: #333;
                margin-top: 0;">Lấy lại mật khẩu</h1>
        <p>Chào ${auth.fullName}</p>
        <p>Mã code để lấy lại mật khẩu là: </p>
        <p style="font-size: 11px;
          font-family: LucidaGrande,tahoma,verdana,arial,sans-serif;
          padding: 14px 32px 14px 32px;
          background-color: #f2f2f2;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          text-align: center;
          border-radius: 7px;
          display: block;
          border: 1px solid #1877f2;
          background: #e7f3ff;">
          <span style="font-size:17px;font-family:Roboto;font-weight:700;margin-left:0px;margin-right:0px">
            ${code}
          </span>
        </p>
      </div>
    `
  sendMail({
    to: auth.email,
    subject: 'Lấy lại mật khẩu',
    html: html,
  })
}

export const uploadSingleFileCloud = async (file, path) => {
  const uploadResponse = await CloudinaryConfig.uploader.upload(file, {
    folder: process.env.CLOUDINARY_FOLDER + path,
    resource_type: 'auto',
  })

  return {
    url: uploadResponse.url,
    publicId: uploadResponse.public_id,
  }
}

export const deleteSingleFileCloud = async (public_id) => {
  const deleteResponse = await CloudinaryConfig.uploader.destroy(public_id)

  return deleteResponse
}
