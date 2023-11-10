const app = require('../server.js')
const supertest = require('supertest')

const request = supertest(app)

describe("Server endpoints", () => {
    test('POST /api/authorization/login login should authorize user', async () => {
        const testUser = {
            email: "2215391@mail.ru",
            password: "LeRa2003",
        };

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const userData = new URLSearchParams();
        userData.set('mail', testUser.email);
        userData.set('password', testUser.password);

        const response = await request.post('/api/authorization/login')
            .set(headers)
            .send(userData.toString());

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeTruthy();
        expect(response.body).toHaveProperty('user');

        const { user } = response.body;


        expect(user).toEqual({
            _id: 1,
            img: "http://localhost:3000/img/user1.jpg",
            FIO: "Чернякова Валерия Алексеевна",
            birth: "2023-10-01",
            mail: "2215391@mail.ru",
            role: "Администратор",
            status: "Активен"
        });
    });

    test('POST /api/createAccount register should create account', async () => {
        const testUser = {
            email: "2103535@mail.ru",
            password: "Bival1970!",
            FIO: "Бивалькевич Татьна Александровна",
            birth: "1970-02-15"
        };

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const userData = new URLSearchParams();
        userData.set('mail', testUser.email);
        userData.set('password', testUser.password);
        userData.set('FIO', testUser.FIO);
        userData.set('birth', testUser.birth);

        const response = await request.post('/api/createAccount')
            .set(headers)
            .send(userData.toString());

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeTruthy();
        expect(response.body).toHaveProperty('user');

        const { user } = response.body;


        expect(user).toEqual({
            _id: 8,
            img: "http://localhost:3000/img/delete.jpg",
            FIO: "Бивалькевич Татьна Александровна",
            birth: "1970-02-15",
            mail: "2103535@mail.ru",
            role: "Пользователь",
            status: "Неподтвержден"
        });
    });
})