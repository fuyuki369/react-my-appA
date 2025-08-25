import { useEffect, useState } from 'react';
import './LessonList.css';

function LessonList2({user,registeredLessons,setRegisteredLessons}) { //授業一覧と登録済み一覧のstate
    const [Lessons, setLessons] =useState([]);                     //授業一覧
    const [message, setMessage] = useState('');                  //メッセージ表示
    const [registeredMessage, setRegisteredMessage] = useState('') //登録済みメッセージ表示


    useEffect(() =>{ //初回だけ実行(授業一覧をまず表示)
        const fetchLesson = async() =>{
            try{
                const response = await fetch('http://localhost:3000/api/lessons');
                const data = await response.json();
                setLessons(data);
            }catch(error){
                console.error('通信エラー',error);
            }
        }
        fetchLesson()
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
        setLessons(dummyLessons);
    },[])  //一回だけ実行！

    const handleRegisterClick = async(lessonId) =>{ //登録ボタンを押した時の処理  ※ここの引数はボタンのID(変数)
        const selectedLesson = Lessons.find((lesson) => lesson.id === lessonId); //選択した授業
        const alreadyRegistered = registeredLessons.some((lesson) => lesson.id === lessonId); //既に登録済み
        const isConflict = registeredLessons.some((registered) =>  //矛盾(重複)
            registered.day === selectedLesson.day && registered.period === selectedLesson.period,
        )
        const today = new Date().toISOString().split('T')[0];  //今日の日付(date)

        //ステップ6 ログイン状態であるか
        if(!user || !user.token){
            setMessage('ログインしてください');
            return;
        }

        //ステップ5 授業があるか
        if(!selectedLesson){
            setMessage('授業が見つかりません');
            return;  //処理を止める
        }

        //ステップ6 開講期間チェック
        if(today < selectedLesson.startDate || today > selectedLesson.endDate){
            setMessage('期間外です。登録できません。');
            return;
        }

        //ステップ4 授業が未登録であるか。
        if(alreadyRegistered){
            setMessage('この授業は既に登録されています。')
            return;
        }

        //ステップ5 時間が重複していないか
        if(isConflict){
            setMessage('時限が重複しています');
            return;
        }

        //ここまで来てAPI送信の処理 
        try{
            const response = await fetch('http://localhost:3000/api/lessons',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    lesson_id: lessonId,
                })
            })
            if(response.ok){
                console.log('登録成功');
            }else{
                console.log('登録失敗:',await response.text());
                return;   //処理を止める
            }
        }catch(error){
            console.error("通信エラー",error)
            return;
        }

        //ここまで来たら登録処理
        setRegisteredLessons([...registeredLessons, selectedLesson])
        setMessage(`登録完了:${selectedLesson.name}`);
    }

    const handleUnregisterClick = async(lessonId) => { //登録解除ボタンの処理
        const undataLessons = registeredLessons.filter((lesson)=> lesson.id !== lessonId);//解除済み授業一覧
        
        try{
            const response = await fetch('http://localhost:3000/api/lessons',{
                method: 'DELETE',  //GETとDELETEはbodyが不要(Content-Typeも不要)
                headers: {
                    Authorization: `bearer ${user.token}`//bearerの後にスペース必須
                }
            });

            if(!response.ok){
                throw new Error('API削除失敗')  //catch(error)に飛ばす
            }

            setRegisteredLessons(undataLessons)
            setRegisteredMessage('登録解除しました')
            console.log('登録解除成功')
        }catch(error){
            console.error('通信エラー:',error);
            setRegisteredMessage('登録解除に失敗しました');
            return;
        }
    }

    return(
        <div className='lesson-container'>
            {/* 授業一覧 */}
            <div className="lessons">
                <h2>授業一覧</h2>
                <ul className='lesson-list'>
                    {Lessons.map((lesson) => ( //ここが()だとreturnを省略できる
                        <li key={lesson.id} className='lesson-item'>
                            {lesson.name}({lesson.day}曜/{lesson.period}限);
                            <button 
                                onClick={() => handleRegisterClick(lesson.id)}
                                disabled={registeredLessons.some((registered) => registered.id === lesson.id)}
                            >
                                {registeredLessons.some((registered) => registered.id === lesson.id) 
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
            <div className="registered-lessons">
            <h3>登録済み授業</h3>
                <ul className='registered-lesson'>
                    {registeredLessons.map((lesson) => (
                        <li key={lesson.id} className='lesson-item'>
                            {lesson.name}({lesson.day}曜/{lesson.period}限);
                            <button onClick={() => handleUnregisterClick(lesson.id)}>登録解除</button>
                            <p>{registeredMessage}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}



export default LessonList2;