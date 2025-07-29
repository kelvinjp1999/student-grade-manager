import http from 'http';
import {v4} from 'uuid';

const port = 3000;
const grades = [
    {
        studentName:"Kelvin",
        subject:"Matemática",
        grade: 8.5
    },
]

const server = http.createServer((request,response) =>{
    //funções do backEnd
    // o request tem esses dois metodos ai desestruturados
    const {method,url} = request
    let body = '';

    request.on('data', chunk => {
        body += chunk.toString();
    })

    request.on('end', () => {
        const id = url.split('/')[2];

        if(url === '/grades' && method === 'GET') {
        response.writeHead(200,{'content-Type': 'application/json'})
        response.end(JSON.stringify(grades))
    } else if(url === '/grades' && method === 'POST') {
        const {id:v4 ,studentName, subject, grade} = JSON.parse(body);
        const newGrade = {
            id: v4(),
            studentName,
            subject,
            grade
        }
        grades.push(newGrade);
        response.writeHead(201, {'content-Type': 'application/json'})
        response.end(JSON.stringify(newGrade))
    }else if(url.startsWith('/grades/') && method === 'PUT'){
        const {studentName, subject, grade} = JSON.parse(body);
        const gradeToUpdate = grades.find(grade => grade.id === id);
        if(gradeToUpdate) {
            gradeToUpdate.studentName = studentName;
            gradeToUpdate.subject = subject;
            gradeToUpdate.grade = grade;

            response.writeHead(200, {'content-Type': 'application/json'})
            response.end(JSON.stringify(gradeToUpdate))
        } else {
            response.writeHead(404, {'content-Type': 'application/json'})
            response.end(JSON.stringify({message: 'Nota não encontrada'}))
        }
    }else if(url.startsWith('/grades/') && method === 'DELETE') {
        const index = grades.findIndex(grade => grade.id === id);
        if(index !== -1) {
            grades.splice(index, 1);
            response.writeHead(204, {'content-Type': 'application/json'})
            response.end();
        } else {
            response.writeHead(404, {'content-Type': 'application/json'})
            response.end(JSON.stringify({message: 'Nota não encontrada'}))
        }

    } else {
        response.writeHead(404, {'content-Type': 'application/json'})
        response.end(JSON.stringify({message: 'Rota não encontrada'}))
    }
    })

    
})

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});