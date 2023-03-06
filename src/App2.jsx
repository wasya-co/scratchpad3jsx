
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

  const mp3Url = 'https://manager.piousbox.com/test1.mp3'

  const writeFile = async () => {

    let blob
    let out

    blob = await fetch(mp3Url
    ).then( res => res.blob()
    ).catch(err => {
      logg(err, 'could not fetch')
    })
    logg(blob, 'blob')


    write_blob({
      path: "test1.mp3",
      directory: Directory.Data,
      blob: blob,
      fast_mode: true,
      recursive: true,
      on_fallback(error) {
        logg(error, 'error 566')
      }
    }).then(function () {
      console.log("Video written.");
    });

    // const reader = new FileReader()
    // await reader.readAsDataURL(blob)
    // reader.onloadend = function() {
    //   var base64data = reader.result;
    //   const writeRes = Filesystem.writeFile({
    //     path: 'test1.mp3',
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


  }

  const readFile = async () => {
    const contents = await Filesystem.readFile({
      path: 'test1.mp3',
      // directory: Directory.Data,
    }).catch(err => {
      logg(err, "could not readFile")
    })

    logg(contents.data, 'contents.data')
    const reader = new FileReader()
    const read = await reader.readAsDataURL(contents.data)
    reader.onloadend = function() {
      var base64data = reader.result;
      logg(base64data, 'loaded the base64data');
    }
    logg(read, 'read 333')

  };

  // useEffect(() => {
  //   writeFile()
  // }, [])

  // readFile()

  NativeAudio.preload({
    assetId: "fire",
    assetPath: `${Directory.Data}/test1.mp3`,
    audioChannelNum: 1,
    // isUrl: true,
  });

  const handleClick = () => {
    NativeAudio.play({
      assetId: 'fire',
    });
  }
  setTimeout(() => {
    NativeAudio.play({
      assetId: 'fire',
    });
  }, 5 * 1000)

  return <>
    <a onClick={handleClick}>abba 3</a>
    <div className="App">
      { /* <audio controls autoPlay >
        <source src={mp3Url} type="audio/mpeg" />
      Your browser does not support the audio element.
      </audio> */ }
    </div>
  </>
}
export default App2

/*

  const writeSecretFile = async () => {
    await Filesystem.mkdir({
      path: 'file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB',
      recursive: true,
    })
    await Filesystem.writeFile({
      path: 'secrets/text.txt',
      data: "This is a test",
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  };



  const deleteSecretFile = async () => {
    await Filesystem.deleteFile({
      path: 'secrets/text.txt',
      directory: Directory.Documents,
    });
  };

  const readFilePath = async () => {
    // Here's an example of reading a file with a full file path. Use this to
    // read binary data (base64 encoded) from plugins that return File URIs, such as
    // the Camera.
    const contents = await Filesystem.readFile({
      path: 'file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/text.txt'
    });

    console.log('data:', contents);
  };


  const readDir = async () =>  {
    let out
    out = await Filesystem.readdir({
      path: '.',
      directory: Directory.Data,
    })
    console.log('readDir out1:', out.inspect)
    logg(out, 'readdir out2')
  }

**/