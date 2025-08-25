//単一ページ型APP

import { useState } from 'react';

import Login from './pages/Login/Login';
import LessonList from './pages/LessonList/LessonList';
import Timetable from './pages/Timetable/Timetable';
import SyllabusSearch from './pages/SyllabusSearch/SyllabusSearch';

function App() {
    const [user,setUser] = useState(null)  //ユーザー保存用
    const [registeredLessons,setRegisteredLessons] = useState([])  //登録した授業保存用

    return (
        <div>
            {/*未ログイン時画面(ログイン画面)*/}
            {!user && 
                <>
                    {/*ログイン画面*/}
                    <Login setUser={setUser}/>

                    {/*シラバス検索機能*/}
                    <SyllabusSearch/>
                </>
            }

            {/*ログイン後学生ページ*/}
            {user && (
                <>
                    {/*履修登録機能*/}
                    <LessonList user={user} 
                        registeredLessons={registeredLessons} 
                        setRegisteredLessons={setRegisteredLessons}
                    />

                    {/*時間割確認機能*/}
                    <Timetable 
                        user={user} 
                        registeredLessons={registeredLessons}
                    />

                    {/*シラバス検索機能*/}
                    <SyllabusSearch/>
                </>
            )}
            
        </div>
    )
}

export default App;