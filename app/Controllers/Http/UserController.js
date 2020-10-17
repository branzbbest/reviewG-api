'use strict'

const UserValidator = require("../../../service/UserValidator")
const UserUtil = require("../../../util/UserUtil.func")
const UserModel = use('App/Models/User')
const numberTypeParamValidator = require('../../../util/numberTypeParamValidator.func')

class UserController {

    async index ({request}) {
      const { references } = request.qs

      const user = await UserUtil(UserModel).getAll(references)

      return { status: 200,error: undefined, data: user}
    }

    async show ({request}) {
      const { id } = request.params
      const { references } = request.qs

      const validateValue = numberTypeParamValidator(id)

      if (validateValue.error)
        return {status: 500, error: validateValue.error, data: undefined }

      const user = await UserUtil(UserModel).getByID(id,references)

      return { status:200,data: user}
    }

    async store({request}) {

      const { email, username, password, display_name } = request.body
      const { references } = request.qs

      const validatedData = await UserValidator(request.body)

      if (validatedData.error)
        return { status: 422, error: validatedData.error, data: undefined }

      const user = await UserUtil(UserModel).create({ email, username, password, display_name }, references)

      return { status: 200, error: undefined, data: user }
    }

    async update({request}) {

      const { body,params,qs } = request
      const { id } = params
      const { email, username, password } = body
      const { references } = qs

      const user = await UserUtil(UserModel).updateByID(id,{ email, username, password }, references)

      return {status: 200 , error: undefined, data: user}
    }

    async destroy ({ request }) {
      const { id } =request.params
      const { references } = request.qs

      const user = await UserUtil(UserModel).deleteByID(id)

      if(user) {
        return {status: 200 , error: undefined, data: { massage: ' success' }}
      }
      else {
        return {status: 200 , error: undefined, data: { massage: ` ${id} not found` }}
      }
    }

    async login ({ request , auth }) {
      const { username, password } = request.body
      const token = await auth.attempt(username,password)
      auth.check()
      return {status: 200 , error: undefined, data: token}
    }
  }

module.exports = UserController
