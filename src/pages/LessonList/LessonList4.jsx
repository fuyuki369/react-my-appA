import { useState,useEffect } from "react";
import './LessonList.css'

function LessonList4({user,registeredLessons,setRegisteredLessons}){
    const [Lessons,setLessons] = useState([]); //授業一覧state
    const [message,setMessage] = useState(''); //メッセージstate
    const [registeredMessage,setRegisteredMessage] = useState(''); //登録済みメッセージstate

    //授業一覧data取得
    useEffect(() =>{
        //授業一覧取得
        const fetchLesson = async() => {
            try{
                const response = await fetch('http://localhost:3000/api/lessons');
                const data = await response.json();
                setLessons(data)
            }catch(error){
                console.error('通信エラー',error);
            }
        }
        //ダミーデータ
        const dummyLessons = [
            {
                id: 1,
                name: "英語基礎",
                day: "月",
                period: 3,
                startDate: "2025-04-01",
                endDate: "2025-07-31"
            },
            {
                id: 2,
                name: "数学A",
                day: "火",
                period: 2,
                startDate: "2025-04-01",
                endDate: "2025-07-31"
            }
        ]
        fetchLesson(),
        setLessons(dummyLessons)
    },[]);

    //登録ボタン処理
    const handleRegisterClick = async(lessonId) => {
        const selectedLesson= Lessons.find((lesson) => lesson.id === lessonId); //選択した授業
        const alreadyRegistered = registeredLessons.some((rLesson) = rLesson.id === lessonId);  //すでに登録済み
        const isConflict = registeredLessons.some ((rLesson) =>
            rLesson.day === selectedLesson.day && rLesson.period === selectedLesson.period, //矛盾(時間重複)
        );
        const today = new Date().toISOString().split('T')[0];//今日の日付

        //ログイン確認
        if(!user||!user.token) {
            setMessage('ログインしてください')
            return;
        }

        //授業があるか
        if(!selectedLesson){
            setMessage('授業が見つかりません')
            return;
        }

        //開講期間チェック
        if(today < selectedLesson.startDate || today > selectedLesson.endDate){
            setMessage('開講期間外です');
            return;
        }

        //登録済みでないか
        if(alreadyRegistered){
            setMessage('既に登録されています');
            return;
        }

        //時間が重複していないか
        if(isConflict){
            setMessage('時限が重複しています')
            return;
        }

        //APi送信処理
        try{
            const response = await fetch('http://localhost:3000/api/lessons',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    Lesson_id: lessonId,
                })
            })
            if(!response.ok){
                console.log('登録失敗:',await response.text());
                return;
            }
            //登録成功
            console.log('登録成功')
            setRegisteredLessons([...registeredLessons,selectedLesson])
            setMessage(`登録完了: ${selectedLesson.name}`)
        }catch(error){
            console.error('通信エラー',error)
        }
    }

    //登録解除ボタン処理
    const handleUnregisterClick = async(lessonId) =>{
        const undataLessons = registeredLessons.filter((rLesson) => rLesson.id !== lessonId); //登録解除済み授業一覧

        //API送信処理
        try{
            const response = await fetch('http://localhost:3000/api/lessons',{
                method: 'DELETE',
                headers: {
                    Authorization: `bearer ${user.token}`,
                }
            })
            if(!response.ok){
                throw new Error('API削除失敗');
            }
            //登録解除成功
            setRegisteredLessons(undataLessons)
            setRegisteredMessage('登録解除しました')
            console.log('登録解除しました')
        }catch(error){
            console.error('通信エラー:',error);
            setRegisteredMessage('登録解除に失敗しました');
            return;
        }
    }

    return(
        <div className="lessons-container">
            {/* 授業一覧 */}
            <div className="lessons">
                <h2>授業一覧</h2>
                <ul className="lesson-list">
                    {Lessons.map((Lesson) => (
                        <li key={Lesson.id} className="lesson-item">
                            {Lesson.name}(曜日:{Lesson.day}/時限:{Lesson.period})
                            <button
                                onClick={() => handleRegisterClick(Lesson.id)}
                                disabled={registeredLessons.some((registered) => registered.id === Lesson.id)}
                            >
                                {registeredLessons.some((registered) => registered.id === Lesson.id)
                                    ? '登録済み'
                                    : '登録'
                                }
                            </button>
                            <p>{message}</p>
                        </li>
                    ))}
                </ul>
            </div>
            {/* 登録済み授業一覧 */}
            <div className="registeredLessons">
                <h3>登録済み授業一覧</h3>
                <ul className="registered-lessons">
                    {registeredLessons.map((rLesson) => (
                        <li key={rLesson.id} className='lesson-item'>
                            {rLesson.name}(曜日:{rLesson.day}/時限:{rLesson.period})
                            <button onClick={() => handleUnregisterClick(rLesson.id)}>登録解除</button>
                            <p>{registeredMessage}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default LessonList4;