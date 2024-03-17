import React, { useEffect, useState } from 'react'
import mp3File from '../music/打回原形.mp3'
import { lyrics } from '../lyricsDatas/lyricsDatas'
import './index.css'

function index() {
  const [lrcParsedArr,setLrcParsedArr] = useState([]);
  const [listOffset,setListOffset] = useState(0);
  const [activeIndex,setActiveIndex] = useState(0)
  const [isInit,setIsInit] = useState(false)


  /**
   * 时间字符串转换
   * @param {*} dateStr
   * @returns time 具体秒数
   */
  const parseTimeStr = (dateStr) => {
    const dateStrLeft = dateStr.split(':')[0]
    const mintes = +dateStrLeft * 60;

    const rightSeconds = +dateStr.split(':')[1]

    return mintes + rightSeconds
  }

  /**
   * 解析歌词文本数据
   * @param {String} lrc 歌词文本数据
   */
  const parseLrcStr = (lrc) => {
    setIsInit(false)
    const lines  = lrc.split('\n');
    const newLinews = []
    lines.forEach(line => {
      const timeStr = line.split(']')[0].slice(1)
      const time = parseTimeStr(timeStr)
      const word =line.split(']')[1]
      newLinews.push({
        time,
        word
      })
    });
    setLrcParsedArr(newLinews)
    setIsInit(true)
  }

  /**
   * 寻找歌词在lrcParsedArr中的下标
   */
  const findLrcIndex = () => {
    const audio =  document.querySelector('#audio')
    const findedIndex = lrcParsedArr.findIndex(item => audio.currentTime < item.time) - 1
    setActiveIndex(findedIndex < 0 ? 0 : findedIndex)
    return findedIndex
  }

  /**
   * 设置歌词transform距离
   */
  const setOffset = () => {
    const lrcIndex = findLrcIndex();
    const container = document.querySelector('#lrc_container')
    const ul =document.querySelector('#lrc_list')
    const line = document.querySelector('li')

    const containerHeight = container.clientHeight;
    const lineHeight = line.clientHeight;

    const lrcToTopHeight = lrcIndex * lineHeight + (lineHeight / 2)
    let offset = lrcToTopHeight - (containerHeight / 2);
    const maxHeight = ul.clientHeight - containerHeight
    if(offset < 0) {
       offset = 0
    }
    if(offset > maxHeight){
      offset = maxHeight
    }
    setListOffset(offset)
  }

  useEffect(() => {
    parseLrcStr(lyrics);
  },[])

  useEffect(() => {
    if(!isInit) return
    document.querySelector('audio').addEventListener('timeupdate',(res) => {
      setOffset()
    })
  },[isInit])

  const renderLrcList = ()  => {
    const listView =  lrcParsedArr?.length ? lrcParsedArr.map((lineObj,idx) => {
      const { word } = lineObj;
      const activeName = activeIndex === idx ? 'lrc_active' : ''
      return (
        <li className={activeName} key={idx}>{`${word}`}</li>
      )
    }) : null

    return listView
  }


  return (
    <div className='player_body'>
      <audio id='audio' className='lyrics_audio' controls src={mp3File}></audio>
      <div id='lrc_container' className="container">
        <ul id='lrc_list' style={{ transform:`translateY(-${listOffset}px)`}} className="lrc_list">
           {renderLrcList()}
        </ul>
      </div>
    </div>
  )
}

export default index
