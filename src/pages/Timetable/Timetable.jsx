import { useEffect,useState } from "react";
import './LessonList.css';


function Timetable({user,registeredLessons}){
    //ログイン確認
    if(!user || !user.token){       //ログイン確認は一番上のほうがいい
        return <p className="login-message">ログインしてください</p>
    }

    const days = ['月','火','水','木','金']  //曜日表示
    const periods = [1,2,3,4,5]              //時限表示

    const [displayType,setDisplayType] = useState('current')  //現在・過去切り替え
    const [clickedLesson,setClickedLesson] = useState(null)   //モーダル表示切り替え

    const dummyLessons = [ //ダミーデータ
        { id: 1, name: "英語", day: "月", period: 2, isCurrent: true},
        { id: 2, name: "数学", day: "火", period: 3, isCurrent: true},
        { id: 3, name: "歴史", day: "水", period: 1, isCurrent: false},
    ]

    //表示される授業をフィルターする
    const filteredLesson = registeredLessons.filter((rLesson)=>  //何度も処理されないようにここに書いておく
        displayType === 'current' ? rLesson.isCurrent : !rLesson.isCurrent //pastは!rLesson.isCurrentで判断される
    )

    return(
        <div className="timetable-container">
            {/*現在・過去切り替え*/}
            <div className="timetable-wrapper">
                <div className="timetable-tabs">
                    <button
                        className={displayType === 'current' ? 'active' : ''}
                        onClick={() => setDisplayType('current')} //() =>で、ボタンを押した時だけ実行
                    >
                        現在
                    </button>
                    <button
                        className={displayType === 'past' ? 'active' : ''}
                        onClick={() => setDisplayType('past')}
                    >
                        過去
                    </button>
                </div>
            </div>
            {/*時間割表*/}
            <table>
                {/*時間割表上部*/}
                <thead>
                    <tr>
                        <th></th>{/*左上空白*/}
                        {days.map((day) =>(
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                {/*時間割表中部*/}
                <tbody>
                    {periods.map((period) => (
                        <tr key={period}>
                            <th>{period}</th>
                            {days.map((day) =>{ //returnの前に処理書くから{}にする
                                const displayedLesson = filteredLesson.find((fLesson) =>(
                                    fLesson.day === day && fLesson.period === period  
                                ))
                                return(
                                    <td 
                                        key={day + period}
                                        className="timetable-call" 
                                        onClick={() => displayedLesson && setClickedLesson(displayedLesson)}
                                    >
                                        {displayedLesson ? displayedLesson.name : ''}  {/*displayedLessonがあるときだけ授業名表示*/}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/*モーダル表示*/}
            {clickedLesson && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{clickedLesson.name}</h2>   
                        <p>曜日:{clickedLesson.day}</p>
                        <p>時限:{clickedLesson.period}</p>
                        <button onClick={() => setClickedLesson(null)}>閉じる</button>
                    </div>
                </div>
            )}
        </div>
    )
}



export default Timetable;