//複数ページ型APP

import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { useState } from 'react';

import Login from './pages/Login/Login';
import LessonList from './pages/LessonList/LessonList';
import Timetable from './pages/Timetable/Timetable';
import SyllabusSearch from './pages/SyllabusSearch/SyllabusSearch';
import Layout from './pages/Layout/Layout.jsx';
import RequireAuth from './component/RequireAuth.jsx';

function App2() {
    const [user,setUser] = useState(null);
    const [registeredLessons,setRegisteredLessons] = useState([]);

    return(
        <BrowserRouter>
            <Routes>
                {/*ログイン画面Route*/}
                <Route path='/login' element={<Login setUser={setUser} />} />

                {/*各ページRoute*/}
                <Route element={<Layout user={user} />}>
                    {/*履修登録画面Route(ログイン必須)*/}
                    <Route 
                        path='/lessons' 
                        element={
                            <RequireAuth user={user}>
                                <LessonList
                                    user={user}
                                    registeredLessons={registeredLessons}
                                    setRegisteredLessons={setRegisteredLessons}
                                />
                            </RequireAuth>
                        } 
                    />
                    {/*時間割確認Route(ログイン必須)*/}
                    <Route 
                        path='/timetable' 
                        element={
                            <RequireAuth user={user}>
                                <Timetable
                                    user={user}
                                    registeredLessons={registeredLessons}
                                />
                            </RequireAuth>
                        } 
                    />
                    {/*シラバス検索Route*/}
                    <Route path='/syllabus' element={<SyllabusSearch/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App2;