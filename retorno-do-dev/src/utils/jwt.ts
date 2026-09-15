import jwt from 'jsonwebtoken'

interface Payload {
  id: number
  name: string
  email: string
  score: number
}

// payload são as informações que enviamos do nosso usuário
export const generateToken = (payload: Payload) => {

    // o método sign de JWT que retorna o toker JWT
    // enviamos as informaçãoes do usuário (payload)
    // o nosso secret
    // e a informação de quando expira
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: Number(process.env.JWT_EXPIRES_IN)
  })
}

export const verifyToken = (token: string) => {
    try {
        // valida o token que estamos passando
        // se for válido, retorna as informações decodificadas do payload (no nosso caso, id e email)
        return jwt.verify(token, process.env.JWT_SECRET!)
    }
    catch (err: any) {
        // se for válido, retorna null
        return null;
    }
}