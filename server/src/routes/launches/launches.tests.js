const request = require('supertest');
const app = require('../../app');

describe('Test GET/launches', () => {
    test('Debe retornar 200', async () => {
        const response = await request(app).get('/launches')
                                    .expect('Content-Type',/json/)
                                    .expect(200);
    })
})
 
 
describe('Test POST/launches', () => {
    test('....', () => {
 
    });
    test('Debe validar campos obligatorios', () => {});
    test('Debe validar el formato de fecha', () => {});
})
