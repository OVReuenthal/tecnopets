import { request, response } from "express"
import { client} from '../DB/db.js'

export const validateUser = async(req = request,res= response,  ) => {
    const id_user = req;

    const sqlInfoUser =`SELECT * FROM "users" WHERE "id_user" = $1 `
    const infoUser = await client.query(sqlInfoUser,[id_user]);

    if(infoUser.rows.length <= 0) {
        throw Error('This user does not exists')
    }
}
