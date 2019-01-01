**=> Base URL:**
    
```
For user login and signup->
POST /api/user/signup ... Request Body(gender,name,email,regno,password,phone)

POST /api/user/login ... Request Body(email,password)
```
```js
{
    "success": true,
    "name": "Vatsal Kandoi",
    "email": "vatsalkandoi1998@gmail.com",
    "regno": "18BEC0001",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMDdkNmM0NmM2ZTA3MWI3N2QwY2YxNyIsInRpbWVzdGFtcCI6MTU0NDAxODI3NjM3OSwiZW1haWwiOiJ2YXRzYWxrYW5kb2kxOTk4QGdtYWlsLmNvbSIsInJlZ25vIjoiMThCRUMwMDAxIiwibmFtZSI6IlZhdHNhbCBLYW5kb2kiLCJpYXQiOjE1NDQwMTgyNzZ9.c4JQHT6LCHdWEemSXwAYXklFFm622-69o19QvLFBSew",
    "attempts": []
}
```

Forgot password
```
POST /api/user/forgotpassword ... Request Body(email)
```
```js
{
    "success": true,
    "message": "Email sent."
}
```

Reset password
```
POST /api/user/resetpassword ... Request Body(password,newpassword)
Request header(Authorization:Bearer token)
```
```js
{
    "success": true,
    "message": "Password updated"
}
```
Generate quiz
POST /api/user/quiz ... Request Body(For)

```js
{
    "success": true,
    "result": {
        "_id": "5c07f83dae0f2836e4822e6a",
        "attempt_ids": [
            {
                "_id": "5c07f85dae0f2836e4822e6f",
                "attempt": "5c07f85cae0f2836e4822e6b",
                "For": "Normal"
            }
        ]
    }
}
{
    "success": false,
    "message": "Quiz attempted of department"
}
```

Get quiz
POST /api/user/getquiz ... Request Body(quiz_id)
```js
{
    "success": true,
    "attempt": {
        "status": false,
        "submit_status": false,
        "evaluator_id": null,
        "total_Score": 0,
        "_id": "5c0806d532e6b640db971dc2",
        "taker": "5c0802fb869be73e787748a9",
        "For": "Normal",
        "questions": [
            {
                "score_given": 0,
                "link": "",
                "mcq_answer": 0,
                "comments": "",
                "_id": "5c0806d532e6b640db971dc5",
                "answer": "",
                "question_id": {
                    "_id": "5c07deff61fa8024674e33aa",
                    "question": "Why are you interesting?",
                    "question_type": 0,
                    "options": [
                        {
                            "_id": "5c07deff61fa8024674e33ac",
                            "number": 1,
                            "content": "Because I say so"
                        },
                        {
                            "_id": "5c07deff61fa8024674e33ab",
                            "number": 2,
                            "content": "I dont know"
                        }
                    ]
                }
            },
            {
                "score_given": 0,
                "link": "",
                "mcq_answer": 0,
                "comments": "",
                "_id": "5c0806d532e6b640db971dc4",
                "answer": "",
                "question_id": {
                    "_id": "5c07e03061fa8024674e33b2",
                    "question": "Why are you interesting?",
                    "question_type": 1,
                    "options": []
                }
            },
            {
                "score_given": 0,
                "link": "",
                "mcq_answer": 0,
                "comments": "",
                "_id": "5c0806d532e6b640db971dc3",
                "answer": "",
                "question_id": {
                    "_id": "5c07e03061fa8024674e33ae",
                    "question": "Why are you interesting?",
                    "question_type": 0,
                    "options": [
                        {
                            "_id": "5c07e03061fa8024674e33b0",
                            "number": 1,
                            "content": "Because I say so"
                        },
                        {
                            "_id": "5c07e03061fa8024674e33af",
                            "number": 2,
                            "content": "I dont know"
                        }
                    ]
                }
            }
        ],
        "__v": 0
    }
}
```

Save quiz
```
POST /api/user/savequiz Request Body()
```
Input
```js
{
	"quiz_id":"5c0806d532e6b640db971dc2",
	"answers":[
                {"link": "",
                "mcq_answer": 0,
                "answer": "Texts aint freaky",
                "question_id": "5c07e03061fa8024674e33b2"},
                {"link": "",
                "mcq_answer": 1,
                "answer": "",
                "question_id": "5c07deff61fa8024674e33aa"},
                {"link": "",
                "mcq_answer": 1,
                "answer": "",
                "question_id": "5c07e03061fa8024674e33ae"}
	]
}
```
Response
```js
{
    "success": true,
    "message": "Saved"
}
```

Submit quiz
```
POST /api/user/submitquiz Request Body(quiz_id,answers)
```
Input
```js
{
	"quiz_id":"5c0806d532e6b640db971dc2",
	"answers":[
                {"link": "",
                "mcq_answer": 0,
                "answer": "You are my fire.",
                "question_id": "5c07e03061fa8024674e33b2"},
                {"link": "",
                "mcq_answer": 1,
                "answer": "",
                "question_id": "5c07deff61fa8024674e33aa"},
                {"link": "",
                "mcq_answer": 1,
                "answer": "",
                "question_id": "5c07e03061fa8024674e33ae"}
	]
}
```
Response
```js
{
    "success": true,
    "message": "Submitted"
}
```
Attempts

```GET /api/user/attempts
```
```js
{
    "success": true,
    "message": "Found",
    "result": [
        {
            "_id": "5c0e8d2a2e896d19d21f2c33",
            "attempt": {
                "status": 0,
                "submit_status": false,
                "accepted": false,
                "_id": "5c0e8d2a2e896d19d21f2c23"
            },
            "For": "Tech-Gen"
        }
    ]
}
```

Quizes given
```GET /api/user/quiz
```
```js
{
    "message": "Found",
    "success": false,
    "result": {
        "_id": "5c0e8d152e896d19d21f2c22",
        "attempt_ids": [
            {
                "For": "Tech-Gen"
            },
            {
                "For": "Normal"
            },
            {
                "For": "Design"
            }
        ]
    }
}
```

Evaluator login
```
POST /api/eval/login ... Request Body(password,name)
```
```js
{
    "success": true,
    "info": {
        "evaluating": null,
        "evaluated": [],
        "_id": "5c08176402d58b48abab1976",
        "name": "vatsal",
        "password": "6ac7f00933165014d1db908e1181ffa75bc7298e8143aa61062b0a08ac6366c0",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE1NDQwMzQzNjczNDEsImFjY2VzcyI6ImNoZWNrZXIiLCJpZCI6IjVjMDgxNzY0MDJkNThiNDhhYmFiMTk3NiIsIm5hbWUiOiJ2YXRzYWwiLCJpYXQiOjE1NDQwMzQzNjd9.b7B2kKQmYISo-LF5RUnho6zD6sVxByVTAD5rJfVAosU"
}
```
Eval dashboard
```
GET /api/eval/dashboard
```
```js
{
    "success": true,
    "message": "Found",
    "attempts": {
        "message": "Found",
        "success": true,
        "attempts": [
            {
                "taker": {
                    "round_selected": 1,
                    "_id": "5c0802fb869be73e787748a9",
                    "gender": "Male",
                    "name": "Vatsal Kandoi",
                    "email": "vatsalkandoi1998@gmail.com",
                    "phone": "9847294751",
                    "regno": "18BEC0001",
                    "password": "2fb5303009eac2efbb25c7ff919478755fa70503bbc11313d8094d3748b2e709",
                    "acmw": true,
                    "attempt_ids": [
                        {
                            "_id": "5c0806d632e6b640db971dc6",
                            "attempt": "5c0806d532e6b640db971dc2",
                            "For": "Normal"
                        }
                    ],
                    "__v": 0
                },
                "id": "5c0806d532e6b640db971dc2",
                "submit_status": true
            }
        ]
    }
}
```
Eval take evaluation
```
POST /api/eval/takeevalutation Request Body(quiz_id)
```
```js
{
    "message": "Found",
    "success": true,
    "attempts": {
        "status": 1,
        "submit_status": true,
        "evaluator_id": "5c08176402d58b48abab1976",
        "total_Score": 0,
        "_id": "5c0806d532e6b640db971dc2",
        "taker": "5c0802fb869be73e787748a9",
        "For": "Normal",
        "questions": [
            {
                "score_given": 0,
                "link": "",
                "mcq_answer": 0,
                "comments": "",
                "_id": "5c080d0b226fe345e6aa0bf1",
                "answer": "You are my fire.",
                "question_id": "5c07e03061fa8024674e33b2"
            },
            {
                "score_given": 0,
                "link": "",
                "mcq_answer": 1,
                "comments": "",
                "_id": "5c080d0b226fe345e6aa0bf0",
                "answer": "",
                "question_id": "5c07deff61fa8024674e33aa"
            },
            {
                "score_given": 0,
                "link": "",
                "mcq_answer": 1,
                "comments": "",
                "_id": "5c080d0b226fe345e6aa0bef",
                "answer": "",
                "question_id": "5c07e03061fa8024674e33ae"
            }
        ],
        "__v": 0
    }
}

```
Eval gets current evaluation of checker
```
GET /api/eval/evalutation Request Body()
```
```js
{
    "message": "Found",
    "success": true,
    "attempts": {
        "status": 1,
        "submit_status": true,
        "evaluator_id": "5c08176402d58b48abab1976",
        "total_Score": 0,
        "_id": "5c0806d532e6b640db971dc2",
        "taker": "5c0802fb869be73e787748a9",
        "For": "Normal",
        "questions": [
            {
                "score_given": 0,
                "link": "",
                "mcq_answer": 0,
                "comments": "",
                "_id": "5c080d0b226fe345e6aa0bf1",
                "answer": "You are my fire.",
                "question_id": "5c07e03061fa8024674e33b2"
            },
            {
                "score_given": 0,
                "link": "",
                "mcq_answer": 1,
                "comments": "",
                "_id": "5c080d0b226fe345e6aa0bf0",
                "answer": "",
                "question_id": "5c07deff61fa8024674e33aa"
            },
            {
                "score_given": 0,
                "link": "",
                "mcq_answer": 1,
                "comments": "",
                "_id": "5c080d0b226fe345e6aa0bef",
                "answer": "",
                "question_id": "5c07e03061fa8024674e33ae"
            }
        ],
        "__v": 0
    }
}

```

Eval posts current evaluation of checker
```
POST /api/eval/evalutation Request Body()
```
Input
```js
{
	"quiz_id":"5c0806d532e6b640db971dc2",
	"answers":[
        {
            "question_id":"5c080d0b226fe345e6aa0bf1",
            "score_given":5,
            "link":"",
            "answer":"You are my fire",
            "mcq_answer":0,
            "comments":"None"
        },
        {
            "question_id":"5c080d0b226fe345e6aa0bf1",
            "score_given":5,
            "link":"",
            "answer":"",
            "mcq_answer":1,
            "comments":"None"
        },
        {
            "question_id":"5c080d0b226fe345e6aa0bf1",
            "score_given":5,
            "link":"",
            "answer":"",
            "mcq_answer":1,
            "comments":"None"
        }
        
    ]
}
```
```js
{
    "success": true,
    "message": "Saved"
}
```

Eval submits current evaluation of checker
```
POST /api/eval/submitevalutation Request Body()
```
Input
```js
{
	"quiz_id":"5c0806d532e6b640db971dc2",
	"answers":[
        {
            "question_id":"5c080d0b226fe345e6aa0bf1",
            "score_given":5,
            "link":"",
            "answer":"You are my fire",
            "mcq_answer":0,
            "comments":"None"
        },
        {
            "question_id":"5c080d0b226fe345e6aa0bf1",
            "score_given":5,
            "link":"",
            "answer":"",
            "mcq_answer":1,
            "comments":"None"
        },
        {
            "question_id":"5c080d0b226fe345e6aa0bf1",
            "score_given":5,
            "link":"",
            "answer":"",
            "mcq_answer":1,
            "comments":"None"
        }
        
    ]
}
```
```js
{
    "success": true,
    "message": "Submitted"
}
```

Admin login
```
POST /api/admin/login ... Request Body(password,name)
```
```js
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJhbGwiLCJ0aW1lc3RhbXAiOjE1NDQwMTg3NjE5ODEsImlhdCI6MTU0NDAxODc2MX0.TTlYVyr8dDEJMbNEVBWN-oJ7w_R-K2jfRZ1f3PHvLPk"
}
{
    "success": false,
    "message": "Enter all"
}
```


Admin add evaluator
```
POST /api/admin/add ... Request Body(password,name)
Request header(Authorization:Bearer token)
```
```js
{
    "success": true,
    "message": "Evaluator added",
    "name": "vatsal"
}
```

Admin get all evaluator
```
GET /api/admin/find ... Request Body()
Request header(Authorization:Bearer token)
```

```js
{
    "success": true,
    "evaluators": [
        {
            "evaluating": null,
            "evaluated": [],
            "_id": "5c07dbc2355d6f22ad4bcf7d",
            "name": "vatsal",
            "password": "6ac7f00933165014d1db908e1181ffa75bc7298e8143aa61062b0a08ac6366c0",
            "__v": 0
        }
    ]
}
```

Admin add questions
```
POST /api/admin/addquestion ... Request Body(question_input,score,correct,For,options,type)
Request header(Authorization:Bearer token)
```
Request Input
```js
{
	"question_input":"Why are you interesting?",
	"score":5,
	"type":0,
	"correct":[{
		"number":1
	}],
	"For":"Normal",
	"options":[
		{
		"number":1,
		"content":"Because I say so"
		},
		{
		"number":2,
		"content":"I dont know"
		}
	]
}
```
Response
```js
{
    "success": true,
    "message": "Question addedd successfully"
}
```

Admin add questions
```
GET /api/admin/addquestions ... Request Body(questions)
Request header(Authorization:Bearer token)
```
Input
```js
{
	"questions":[
		{"question_input":"Why are you interesting?",
	"score":5,
	"type":0,
	"correct":[{
		"number":1
	}],
	"For":"Normal",
	"options":[
		{
		"number":1,
		"content":"Because I say so"
		},
		{
		"number":2,
		"content":"I dont know"
		}
	]},
	{
		"question_input":"Why are you interesting?",
	"score":5,
	"type":1,
	"correct":[],
	"For":"Normal",
	"options":[]
		
	}	
	]
}
```
Response
```js
{
    "success": true,
    "not_added": []
}
```

Admin get all questions
```
GET /api/admin/getallquestions ... Request Body()
Request header(Authorization:Bearer token)
```

```js
{
    "success": true,
    "message": "Questions found",
    "questions": [
        {
            "_id": "5c07deff61fa8024674e33aa",
            "question": "Why are you interesting?",
            "score": 5,
            "question_type": 0,
            "options": [
                {
                    "_id": "5c07deff61fa8024674e33ac",
                    "number": 1,
                    "content": "Because I say so"
                },
                {
                    "_id": "5c07deff61fa8024674e33ab",
                    "number": 2,
                    "content": "I dont know"
                }
            ],
            "For": "Normal",
            "correct": [
                {
                    "_id": "5c07deff61fa8024674e33ad",
                    "number": 1
                }
            ],
            "__v": 0
        },
        {
            "_id": "5c07e03061fa8024674e33b2",
            "question": "Why are you interesting?",
            "score": 5,
            "question_type": 1,
            "options": [],
            "For": "Normal",
            "correct": [],
            "__v": 0
        },
        {
            "_id": "5c07e03061fa8024674e33ae",
            "question": "Why are you interesting?",
            "score": 5,
            "question_type": 0,
            "options": [
                {
                    "_id": "5c07e03061fa8024674e33b0",
                    "number": 1,
                    "content": "Because I say so"
                },
                {
                    "_id": "5c07e03061fa8024674e33af",
                    "number": 2,
                    "content": "I dont know"
                }
            ],
            "For": "Normal",
            "correct": [
                {
                    "_id": "5c07e03061fa8024674e33b1",
                    "number": 1
                }
            ],
            "__v": 0
        }
    ]
}

```
