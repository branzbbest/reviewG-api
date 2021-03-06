'use strict'

const AdminValidator = require('../../../service/AdminValidator')
const AdminModel = use('App/Models/Admin')
const AdminUtil = require('../../../util/AdminUtil.func')
const numberTypeParamValidator = require('../../../util/numberTypeParamValidator.func')

class AdminController {

    async index ({request}) {
        const { references } = request.qs

        const admin = await AdminUtil(AdminModel).getAll(references)

        return { status: 200,error: undefined, data:  admin}
    }

    async show ({request}) {
        const { id } = request.params
        const { references } = request.qs
        const validateValue = numberTypeParamValidator(id)

        if (validateValue.error) {
            return {status: 500, error: validateValue.error, data: undefined }
        }

        const admin = await AdminUtil(AdminModel).getByID(id,references)

        return { status:200,data: admin || {}}
    }

    async store({request}) {

      const { username, password, email, display_name } = request.body
      const { references } = request.qs

      const validatedData = await AdminValidator(request.body)

      if (validatedData.error)
        return { status: 422, error: validatedData.error, data: undefined }

      const user = await AdminUtil(AdminModel).create({email, username, password, display_name}, references)

      return { status: 200, error: undefined, data: user }
    }

    async update({request}){

        const { body,params,qs } = request
        const { id } = params
        const { username,password,email } = body
        const { references } = qs

        const admin = await AdminUtil(AdminModel).updateByID(id,{email, username, password, display_name}, references)

      return {status: 200 , error: undefined, data: admin}
      }

    async destroy ({ request }) {
        const { params , qs } =request
        const { id } = params
        const { references} = qs

        const admin = await AdminUtil(AdminModel).deleteByID(id)

        if(admin) {
            return {status: 200 , error: undefined, data: { massage: ' success' }}
        }
        else {
            return {status: 200 , error: undefined, data: { massage: ` ${id} not found` }}
        }
      }

      async login({request}) {
        const { username, password } = request.body
        const user = await AdminUtil(AdminModel).getByUsernamePassword(username,password)
        return {status:200, error:undefined, data: user }
        }
      }

module.exports = AdminController
