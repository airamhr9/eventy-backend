import { expect } from 'chai'
import { registerT } from '../src/users/register.js'
import { joinEvent } from '../src/events/joinEvent.js'
import { publishEventT } from '../src/events/publish.js'
import { getEventParticipantsT } from '../src/events/participants.js'

var userId, event1, event2, expectedParticipants1, expectedParticipants2

/*describe('#joinEventTest()', function(){

    this.beforeAll(async function(){

      expectedParticipants1 = [
        ["apdrSlPckNbCYagg2SmYV2cGjUm2", "0-USERTESTING" ],
        []
      ]

      expectedParticipants2 = [
        ["apdrSlPckNbCYagg2SmYV2cGjUm2" ],
        ["0-USERTESTING" ]
      ]

      userId = await registerT("0-USERTESTING","UsuarioPrueba", "userPassword", "usuarioparatesting@gmail.com", "userBirthDate")

      event1 = "1-EVENTTESTING"
      event2 = "2-EVENTTESTING"

      publishEventT(event1,"description", "finishDate", "images", "latitude", "longitude", "maxParticipants", "name", "apdrSlPckNbCYagg2SmYV2cGjUm2", 
      "price", "isPrivate", "startDate", "summary", "tags")

      publishEventT(event2,"description", "finishDate", "images", "latitude", "longitude", "maxParticipants", "name", "apdrSlPckNbCYagg2SmYV2cGjUm2", 
      "price", "isPrivate", "startDate", "summary", "tags")

    })

    
    it('addParticipant', async function(){
      await joinEvent(event1, userId, Boolean(true))
      await getEventParticipantsT(event1).then( async function(res){

        expect(res).deep.equal(expectedParticipants1)

      })

    })

    it('addPosibleParticipant', async function(){
      await joinEvent(event2, userId, Boolean(false))
      await getEventParticipantsT(event2).then( async function(res){

        expect(res).deep.equal(expectedParticipants2)

      })

    })


})*/
