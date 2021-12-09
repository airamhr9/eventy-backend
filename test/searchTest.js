import { searchT } from '../src/search/search.js'
import { expect } from 'chai'


var paramsTest, expectedLength, expectedMembers, paramsFilt, expectedMembersFilt, expectedLengthFilt

/*describe('#searchTest()', function(){

    this.beforeAll(function(){
        //[searchText, searchTags, filters, enableFilt]
        paramsTest = [
            '',
            ['Museo', 'Fiesta', 'Relax'],
            [],
            undefined
        ]

        expectedLength = 7

        expectedMembers = [ {
            "averageScore" : 0,
            "description" : "Fiesta de bienvenida para todos los estudiantes de erasmus en valencia",
            "finishDate" : "2021-12-25T03:00:00.894718",
            "id" : 0,
            "images" : [ "erasmus.png" ],
            "latitude" : 32.456232931711405,
            "longitude" : -1.378832752824911,
            "maxParticipants" : 300,
            "name" : "Fiesta erasmus",
            "owner" : "niMeffxvboZAdeimcmoy03Swjfk1",
            "participants" : [ "niMeffxvboZAdeimcmoy03Swjfk1", "8rKa5lPLoYVD3UsQif3nqYV0cJ73", "Xamie8BQKCdD6mup0ew5KlQFBiI2", "JL27oXV1FJhs0dr4GX1A1EV2km03", "x73oU1lVYkNNVkkIferhWDpWxNp1", "fgZxwUXwphO3qySResjKsCCqMk33" ],
            "possiblyParticipants" : [ "YT2EEXyEd9XKDb2nKkIMP5UELqw2", "gBDVdiNLi5cVNXkaJPtPneDV3P82" ],
            "price" : 25,
            "private" : false,
            "startDate" : "2021-09-24T20:00:00.894718",
            "summary" : "Fiesta de bienvenida",
            "tags" : [ "Erasmus", "Fiesta" ]
          }, {
            "averageScore" : 0,
            "description" : "Exposición en el Museo de las Ciencias sobre bla, bla, bla",
            "finishDate" : "2022-12-09T13:30:00.894718",
            "id" : 2,
            "images" : [ "museo_ciencias_1.jpg", "museo_ciencias_2.jpg" ],
            "latitude" : 38.456232931711405,
            "longitude" : -0.37883275282491097,
            "maxParticipants" : -1,
            "name" : "Visita al Museo de las Ciencias",
            "owner" : "niMeffxvboZAdeimcmoy03Swjfk1",
            "participants" : [ "niMeffxvboZAdeimcmoy03Swjfk1", "Xamie8BQKCdD6mup0ew5KlQFBiI2", "JL27oXV1FJhs0dr4GX1A1EV2km03", "niMeffxvboZAdeimcmoy03Swjfk1" ],
            "price" : 15,
            "private" : false,
            "startDate" : "2022-12-09T11:00:00.894718",
            "summary" : "Visita a la exposición del Museo de las Ciencias de octubre",
            "tags" : [ "Museos", "Cultura" ]
          }, {
            "averageScore" : 0,
            "description" : "La biblioteca de la etsinf regala libros de ediciones antiguas, ven a recoger el que te apetezca",
            "finishDate" : "2021-12-21T11:25:55.894718",
            "id" : 3,
            "images" : [ "scaled_image_picker2154400090595674564.jpg" ],
            "latitude" : 39.4830058424561,
            "longitude" : -0.3472847118973732,
            "maxParticipants" : 60,
            "name" : "Biblioteca ETSINF regala libros",
            "owner" : "Xamie8BQKCdD6mup0ew5KlQFBiI2",
            "participants" : [ "Xamie8BQKCdD6mup0ew5KlQFBiI2" ],
            "possiblyParticipants" : [ "gBDVdiNLi5cVNXkaJPtPneDV3P82" ],
            "price" : 0,
            "private" : false,
            "startDate" : "2021-12-20T11:25:55.894674",
            "summary" : "La biblioteca de la etsinf regala libros de ediciones antiguas, ven a recoger el que te apetezca",
            "tags" : [ "Museos", "Tecnología", "Cultura" ]
          }, {
            "averageScore" : 0,
            "description" : "Lo del resumen pero más explicao",
            "finishDate" : "2023-11-11T00:00:00.000",
            "id" : 4,
            "images" : [ "scaled_image_picker6729762299926595420.jpg" ],
            "latitude" : 28.75386389926171,
            "longitude" : -18.003280945122242,
            "maxParticipants" : 20,
            "name" : "Visita puerto puntagorda",
            "owner" : "YT2EEXyEd9XKDb2nKkIMP5UELqw2",
            "participants" : [ "YT2EEXyEd9XKDb2nKkIMP5UELqw2", "niMeffxvboZAdeimcmoy03Swjfk1", "Dfsx7DZ8LoQMZQM1OqNbt8iUcrH3", "gBDVdiNLi5cVNXkaJPtPneDV3P82", "x73oU1lVYkNNVkkIferhWDpWxNp1" ],
            "price" : 3,
            "private" : false,
            "startDate" : "2022-10-26T11:00:00.000",
            "summary" : "Visita al puerto de Puntagorda, La Palma",
            "tags" : [ "Senderismo", "Aventura", "Fiesta" ]
          }, {
            "averageScore" : 1,
            "description" : "sufrimiento alimenticio en mi casa",
            "finishDate" : "2021-10-25T04:00:00.000",
            "id" : 5,
            "images" : [ "scaled_image_picker3133796077309072071.jpg" ],
            "latitude" : 39.3570191,
            "longitude" : -0.3249459,
            "maxParticipants" : 69,
            "messages" : {
              "-Mo8A_jtFBsCMeKXPB9S" : {
                "id" : "-Mo8A_jtFBsCMeKXPB9S",
                "images" : "antonio.png",
                "text" : "hola se ve rico",
                "time" : "2021-11-10T10:29:30.949072",
                "userId" : "niMeffxvboZAdeimcmoy03Swjfk1",
                "username" : "antoniogabinete"
              }
            },
            "name" : "comida familiar",
            "owner" : "x73oU1lVYkNNVkkIferhWDpWxNp1",
            "participants" : [ "x73oU1lVYkNNVkkIferhWDpWxNp1" ],
            "price" : 69,
            "private" : false,
            "scores" : [ {
              "score" : 1,
              "user" : "x73oU1lVYkNNVkkIferhWDpWxNp1"
            } ],
            "startDate" : "2021-10-24T02:00:00.000",
            "summary" : "a comer a mi casa",
            "tags" : [ "Comida", "Fiesta" ]
          }, {
            "averageScore" : 4.5,
            "description" : "Pues eso. Sed discretos 😇",
            "finishDate" : "2022-01-07T00:00:00.000",
            "id" : 6,
            "images" : [ "scaled_image_picker5833983577599115419.jpg" ],
            "latitude" : 39.494790806991446,
            "longitude" : -0.4358113557100296,
            "maxParticipants" : -1,
            "messages" : {
              "-MoFGsKksVfPEPFclEvi" : {
                "id" : "-MoFGsKksVfPEPFclEvi",
                "images" : "scaled_image_picker7723259893779204683.jpg",
                "text" : "que buen evento",
                "time" : "2021-11-11T19:34:21.853592",
                "userId" : "fgZxwUXwphO3qySResjKsCCqMk33",
                "username" : "juan el drogas"
              },
              "-MoFIvsafgF6dKx7X5nM" : {
                "id" : "-MoFIvsafgF6dKx7X5nM",
                "images" : "scaled_image_picker7723259893779204683.jpg",
                "text" : "quereis que lleve alguna cosita para pasarlo aun mejor?",
                "time" : "2021-11-11T19:43:20.665692",
                "userId" : "fgZxwUXwphO3qySResjKsCCqMk33",
                "username" : "juan el drogas"
              }
            },
            "name" : "Reunion de fans de tom cruising",
            "owner" : "niMeffxvboZAdeimcmoy03Swjfk1",
            "participants" : [ "niMeffxvboZAdeimcmoy03Swjfk1", "apdrSlPckNbCYagg2SmYV2cGjUm2", "x73oU1lVYkNNVkkIferhWDpWxNp1", "JL27oXV1FJhs0dr4GX1A1EV2km03" ],
            "price" : 50,
            "private" : false,
            "scores" : [ {
              "score" : 4.5,
              "user" : "fgZxwUXwphO3qySResjKsCCqMk33"
            } ],
            "startDate" : "2022-01-06T16:00:00.000",
            "summary" : "Tete a tete con Tom Cruise. Vente y pasamos un buen rato 😏😋",
            "tags" : [ "Acampada", "Fiesta", "Relax", "Aventura", "Comida" ]
          }, {
            "averageScore" : 0,
            "description" : "Pasear perros por el parque. Si no tienes perro, también puedes traer a tu gato o a tu tortuga. Por favor, no traigas a tu pez",
            "finishDate" : "2022-03-20T05:00:00.000",
            "id" : 9,
            "images" : [ "scaled_image_picker5237641603764340276.jpg", "scaled_image_picker208339788143761763.jpg", "scaled_image_picker6999367331305784955.jpg" ],
            "latitude" : 39.465707209741666,
            "longitude" : -0.36024749279022217,
            "maxParticipants" : -1,
            "messages" : {
              "-ModW6uD2eH3s9mB4gnH" : {
                "id" : "-ModW6uD2eH3s9mB4gnH",
                "images" : "",
                "text" : "que pasa",
                "time" : "2021-11-16T17:11:28.808854",
                "userId" : "apdrSlPckNbCYagg2SmYV2cGjUm2",
                "username" : "Ruben Pruebas"
              }
            },
            "name" : "Pasear perros",
            "owner" : "8qQpJyOmcCRAh9pZ4yFvntVu4oq2",
            "participants" : [ "8qQpJyOmcCRAh9pZ4yFvntVu4oq2", "niMeffxvboZAdeimcmoy03Swjfk1", "apdrSlPckNbCYagg2SmYV2cGjUm2", "x73oU1lVYkNNVkkIferhWDpWxNp1" ],
            "possiblyParticipants" : [ "uDsfjAOgTaZ72cFRaCEm47ipS833" ],
            "price" : 0,
            "private" : false,
            "startDate" : "2022-01-09T00:00:00.000",
            "summary" : "Pasear perros por el parque",
            "tags" : [ "Relax", "Animales" ]
          }]

          
        paramsFilt = [
          '',
          [],
          //[unique day, start date, finish date, maxPrice, localization, minPrice]
          [false, new Date(Date.now()), new Date(2022, 1, 20), 50, [39.483576585548036, -1.3474393230643172], 0],
          true
        ]

        expectedLengthFilt = 2

        expectedMembersFilt = [
          {
            "averageScore" : 0,
            "description" : "Exposición en el Museo de las Ciencias sobre bla, bla, bla",
            "finishDate" : "2022-12-09T13:30:00.894718",
            "id" : 2,
            "images" : [ "museo_ciencias_1.jpg", "museo_ciencias_2.jpg" ],
            "latitude" : 38.456232931711405,
            "longitude" : -0.37883275282491097,
            "maxParticipants" : -1,
            "name" : "Visita al Museo de las Ciencias",
            "owner" : "niMeffxvboZAdeimcmoy03Swjfk1",
            "participants" : [ "niMeffxvboZAdeimcmoy03Swjfk1", "Xamie8BQKCdD6mup0ew5KlQFBiI2", "JL27oXV1FJhs0dr4GX1A1EV2km03", "niMeffxvboZAdeimcmoy03Swjfk1" ],
            "price" : 15,
            "private" : false,
            "startDate" : "2022-12-09T11:00:00.894718",
            "summary" : "Visita a la exposición del Museo de las Ciencias de octubre",
            "tags" : [ "Museos", "Cultura" ]
          }, {
            "averageScore" : 0,
            "description" : "La biblioteca de la etsinf regala libros de ediciones antiguas, ven a recoger el que te apetezca",
            "finishDate" : "2021-12-21T11:25:55.894718",
            "id" : 3,
            "images" : [ "scaled_image_picker2154400090595674564.jpg" ],
            "latitude" : 39.4830058424561,
            "longitude" : -0.3472847118973732,
            "maxParticipants" : 60,
            "name" : "Biblioteca ETSINF regala libros",
            "owner" : "Xamie8BQKCdD6mup0ew5KlQFBiI2",
            "participants" : [ "Xamie8BQKCdD6mup0ew5KlQFBiI2" ],
            "possiblyParticipants" : [ "gBDVdiNLi5cVNXkaJPtPneDV3P82" ],
            "price" : 0,
            "private" : false,
            "startDate" : "2021-12-20T11:25:55.894674",
            "summary" : "La biblioteca de la etsinf regala libros de ediciones antiguas, ven a recoger el que te apetezca",
            "tags" : [ "Museos", "Tecnología", "Cultura" ]
          }
        ]
    })

    it('return all the events', async function(){
      searchT('', [], [], undefined).then(function(res){
        expect(res).to.have.lengthOf(10) //all the events at the BD (23/11/2021)
      })
    })

    it('return expected events from DB', async function(){
      searchT(paramsTest[0], paramsTest[1], paramsTest[2], paramsTest[3]).then(function(result){
        expect(result).to.exist //the result is at least generated
        expect(result).to.have.lengthOf(expectedLength) //the result must have 7 events 
        expect(result).to.have.members(expectedMembers) //the result must contain this events  
      })            
    })

    it('return expected filtered events from DB', async function(){
        searchT(paramsFilt[0], paramsFilt[1], paramsFilt[2], paramsFilt[3]).then(function(result){
          expect(result).to.exist //the result is at least generated
          expect(result).to.have.lengthOf(expectedLengthFilt) //the result must have 7 events 
          expect(result).to.have.members(expectedMembersFilt) //the result must contain this events 
        })
    })


})*/