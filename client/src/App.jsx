import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: null,
      uploading: false,
      message: '',
    };
  }

  handleFileChange = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  };

  handleUpload = (event) => {
    event.preventDefault();
    if (this.state.uploading) return;
    if (!this.state.selectedFile) {
      this.setState({ message: 'Select a file first' });
      return;
    }
    this.setState({ uploading: true, loaded: 0 });

    const data = new FormData();
    data.append('file', this.state.selectedFile, this.state.selectedFile.name);

    // Define your API endpoint here (e.g., 'https://example.com/upload')
    const endpoint = 'http://localhost:5000/upload';

    axios
      .post(endpoint, data, {
        onUploadProgress: (ProgressEvent) => {
          this.setState({
            loaded: Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100),
          });
        },
      })
      .then((res) => {
        this.setState({
          selectedFile: null,
          message: 'Uploaded successfully',
          uploading: false,
        });
        console.log(res.statusText);
      })
      .catch((error) => {
        this.setState({
          message: 'Upload failed',
          uploading: false,
        });
        console.error(error);
      });
  };

  render() {
    return (
      <form className="box" onSubmit={this.handleUpload}>
        <input
          type="file"
          name="file-5[]"
          id="file-5"
          className="inputfile inputfile-4"
          onChange={this.handleFileChange}
        />
        <label htmlFor="file-5">
          <figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="17"
              viewBox="0 0 20 17"
            >
              <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2 .9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" />
            </svg>
          </figure>
          <span>
            {this.state.uploading ? this.state.loaded + '%' : this.state.message}
          </span>
        </label>
        <button className="submit" type="submit">
          Upload
        </button>
      </form>
    );
  }
}

export default App;
