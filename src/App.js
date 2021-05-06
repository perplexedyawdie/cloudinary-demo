import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import './App.css';

function App() {
  const baseURL = "https://api.cloudinary.com/v1_1/northway-labs/image/upload";
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  //Add the selected files to state
  const changeHandler = (event) => {
    let files = []
    if (event.target.files.length > 0) {

      [...event.target.files].forEach(file => {
        files.push({
          id: uuidv4(),
          item: file
        })
      });
    }
    setSelectedFiles(files);
    console.info(files)
  };


  const uploadFiles = () => {
    selectedFiles.forEach((file) => {
      let formData = new FormData();
      formData.append("file", file.item);
      formData.append("upload_preset", "l4pvtd2d");

      axios.post(baseURL, formData)
        .then((data) => {
          if (data.request.response !== '') {
            let resp = JSON.parse(data.request.response)
            return {
              id: uuidv4(),
              url: resp.secure_url
            }
          }
        })
        // Details on using previous state: https://reactjs.org/docs/hooks-reference.html#functional-updates
        .then((url) => setImageUrls(prevURLS => [...prevURLS, url]))
        .catch(err => console.error(err));
    })
  }

  return (
    <section className="hero is-fullheight">
      <div className="hero-body has-text-centered">
        <div className="container">
          <div className="file is-centered is-boxed is-success has-name">
            <label className="file-label">
              <input className="file-input" type="file" name="cloudJPG" onChange={changeHandler} multiple />
              <span className="file-cta">
                <span className="file-icon">
                  <ion-icon name="images-outline" size="large"></ion-icon>
                </span>
                <span className="file-label">
                  Choose your files
      </span>
              </span>
              <ul className="uk-list uk-list-striped">
                {
                  selectedFiles.length > 0 ? selectedFiles.map((file) => {
                    return <li key={file.id}>{file.item.name}</li>
                  }) : <></>
                }
              </ul>
            </label>
          </div>
          <div>
            <button onClick={uploadFiles} className="button is-success is-outlined">
              <span className="icon is-medium">
                <ion-icon name="rocket-outline" size="large"></ion-icon>
              </span>
              <span>Upload your files</span></button>
          </div>
          <div className="box mt-5 has-text-centered">
            <h2 className="subtitle">Uploaded File URLs</h2>
            <div>
              <ul className="uk-list uk-list-divider">
              {
                imageUrls.length > 0 ? imageUrls.map((img) => {
                    return <li key={img.id}><a href={img.url}>{img.url}</a></li>
                  }) : <></>
                }

              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
