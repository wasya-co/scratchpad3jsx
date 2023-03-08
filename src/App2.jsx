
import axios from 'axios'
import {Capacitor} from "@capacitor/core";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import {NativeAudio} from '@capacitor-community/native-audio'
import write_blob from "capacitor-blob-writer";
import React, { useEffect } from 'react'

/**
 * Usage: logg(someObject, 'label')
 *
 * This development-grade logger can be used instead of console.log() with some advantages:
 * * It encourages consistent labeling of logs. By labeling each log line, you can have dozens of log lines
 * written per action, and still know which log line comes from where.
 * The recommended label is the component name, or function name.
 * * If the label is present, the logged object is placed in the window, allowing you to inspect it in the console. The
 * label becomes the name of the object (stripped to [0-9a-zA-Z\-_] chars). If you're logging a function, you can execute it.
 * If you log more than one thing, they can interact, allowing you to validate control flow.
 * * the logger can be turned off by making this function simply return.
 */
const logg = (a, b="", c=null) => {
  if ('undefined' === typeof window) { return }

  c = "string" === typeof c ? c : b.replace(/\W/g, "");
  if (c.length > 0) {
    window[c] = a;
  }
  console.log(`+++ ${b}:`, a); // eslint-disable-line no-console
};


/**
 * ReadWrite files
**/
const App2 = (props) => {

  const fileName = 'test2.mp3'
  const mp3Url = `https://manager.piousbox.com/${fileName}`

  const writeFile = async () => {

    let blob

    blob = await fetch(mp3Url
    ).then( res => res.blob()
    ).catch(err => {
      logg(err, 'could not fetch')
    })
    logg(blob, 'blob')


    write_blob({
      path: fileName,
      directory: Directory.External,
      blob: blob,
      fast_mode: true,
      recursive: true,
      on_fallback(error) {
        logg(error, 'error 566')
      }
    }).then(function () {
      logg("Video written.");
    });
  }

  const readFile = async () => {

    let mp3Uri = await Filesystem.getUri({
      path: fileName,
      directory: Directory.External,
    })
    mp3Uri = mp3Uri.uri
    logg(mp3Uri, 'uri')

    NativeAudio.preload({
      assetId: "fire",
      assetPath: mp3Uri,
      // audioChannelNum: 1,
      isUrl: true,
    })

  }

  useEffect(() => {
    // writeFile()
    readFile()
  }, [])

  const handleClick = () => {
    NativeAudio.play({
      assetId: 'fire',
    });
  }

  return <>
    <a onClick={handleClick}>abba 3</a>
    <div className="App">

    </div>
  </>
}
export default App2









// <audio controls autoPlay >
//   <source src={mp3Url} type="audio/mpeg" />
// </audio>


    // const reader = new FileReader()
    // await reader.readAsDataURL(blob)
    // reader.onloadend = function() {
    //   var base64data = reader.result;
    //   const writeRes = Filesystem.writeFile({
    //     path: fileName,
    //     // data: base64data,
    //     data: blob,
    //     // directory: Directory.Data,
    //   }).then(e => {
    //     logg(e, 'wroteMusicFile 222')
    //   }).catch(err => {
    //     logg(err, "could not write music file 222")
    //   })
    // }

    // await axios.get( mp3Url, { responseType: 'arraybuffer'
    // }).then(async res => {
    //   blob = res.blob()
    //   const reader = new FileReader()
    //   const read = reader.readAsDataURL(blob)
    //   logg(read, 'read')
    // }).catch(err => {
    //   logg(err, 'could not GET mp3')
    // })



