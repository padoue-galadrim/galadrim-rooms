import { hasRights } from '@galadrim-rooms/shared/'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Restaurant from '../../../../Models/Restaurant'
import Ws from '../../../../Services/Ws'

export const destroyRoute = async ({ params, auth, response }: HttpContextContract) => {
    const restaurant = await Restaurant.findOrFail(params.id)
    const user = auth.user!
    if (!hasRights(user.rights, ['MIAM_ADMIN'])) {
        return response.forbidden({ error: `Vous n'avez pas les droits nécessaires` })
    }
    const eventJson = restaurant.toJSON()
    await restaurant.delete()
    Ws.io.to('connectedSockets').emit('deleteTag', eventJson)
    return { id: restaurant.id, deleted: true }
}
