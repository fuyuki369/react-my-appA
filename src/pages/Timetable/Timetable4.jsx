import { useState } from "react";
import './Timetable.css'

function Timetable4({user,registeredLessons}){
    //ログイン確認
    if(!user||!user.token){
        return <p>ログインしてください</p>
    }

    const days = ['月','火','水','木','金'];  //曜日表示用
    const periods = [1,2,3,4,5];             //時限表示用

    const [displayType,setDisplayType] = useState('current'); //過去・現在state
    const [clickedLesson,setClickedLesson] = useState(null);    //モーダル表示state

    const dummyLessons = [ //ダミーデータ
        { id: 1, name: "英語", day: "月", period: 2, isCurrent: true},
        { id: 2, name: "数学", day: "火", period: 3, isCurrent: true},
        { id: 3, name: "歴史", day: "水", period: 1, isCurrent: false},
    ]

    const filteredLesson = registeredLessons.filter((rLesson) =>
        displayType === 'current' ? rLesson.isCurrent : !rLesson.isCurrent,
    )

    return(
        <div className="timetable-container">
            {/*現在・過去切り替え*/}
                <div className="timetable-wrapper">
                    <div className="timetable-tabs">
                        <button
                            className={displayType === 'current' ? 'active' : ''}
                            onClick={() => setDisplayType('current')}
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
                        <th></th>{/*左上空白用*/}
                        {days.map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                {/*時間割表中部*/}
                <tbody>
                    {periods.map((period) =>
                        <tr key={period}>
                            <th>{period}</th>
                            {days.map((day) => {
                                const displayedLesson = filteredLesson.find((fLesson) =>
                                    fLesson.day === day && fLesson.period === period,
                                )
                                return(
                                    <td 
                                        key={period + day}
                                        className="timetable-call" 
                                        onClick={() => setClickedLesson(displayedLesson)}
                                    >
                                        {displayedLesson ? displayedLesson.name : ''};
                                    </td>
                                )
                            })}
                        </tr>
                    )}
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

export default Timetable4;