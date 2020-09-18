import { extend } from 'vee-validate'
import { email, required } from 'vee-validate/dist/rules'

extend('email', email)
extend('required', required)
