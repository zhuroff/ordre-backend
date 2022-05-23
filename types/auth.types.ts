type Authentication = {
  email: string
  password: string
}

type Registration = Authentication & {
  passwordConfirm: string
}

export type {
  Authentication,
  Registration
}
