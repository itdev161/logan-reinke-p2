const ImageUpload = ({
  path,
  min,
  max,
  onSave,
  onError,
  onCancel,
  edit,
  title,
  autoUpload,
}) => {
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (event) => {
      let img = document.createElement("img");
      img.onload = () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        let MAX = max > 2000 ? 2000 : max;
        let MIN = min < 75 ? 75 : min;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX) {
            height *= MAX / width;
            width = MAX;
          }
        } else {
          if (height > MAX) {
            width *= MAX / height;
            height = MAX;
          }
        }

        if (width < MIN) {
          height *= MIN / width;
          width = MIN;
        } else if (height < MIN) {
          width *= MIN / height;
          height = MIN;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        let dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setFile(dataUrl);
        autoUpload && saveImageToStorage(dataUrl);
        // saveImageToStorage(dataUrl)
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const rotatePic = (direction) => {
    let degrees = direction === "left" ? -90 : 90;
    let canvas = document.createElement("canvas");
    let img = document.createElement("img");
    img.src = file;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    let width = img.width;
    let height = img.height;

    canvas.width = width;
    canvas.height = height;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (height < width) {
      ctx.rotate((degrees * Math.PI) / 180);
    }
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
    let dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setFile(dataUrl);
  };

  const getFileBlob = (url, cb) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.addEventListener("load", () => {
      cb(xhr.response);
    });
    xhr.send();
  };

  const saveImageToStorage = (dataUrl) => {
    setLoading(true);
    let ref = firebase.storage().ref();
    let picRef = ref.child(path);
    const imageUrl = dataUrl || file;
    getFileBlob(imageUrl, (blob) => {
      picRef
        .put(blob)
        .then((snap) => {
          setLoading(false);
          picRef
            .getDownloadURL()
            .then((url) => onSave(url))
            .catch((err) => onError(err.message));
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          onError(err.message);
        });
    });
  };

  const handleCancelClick = () => {
    setFile(null);
    document.getElementById("imageUploadInput").value = "";
    onCancel();
  };

  return (
    <div className="fc c w100">
      {title && <p className="md mB20">{title}</p>}
      <input
        type="file"
        accept=".jpg, .png, .jpeg"
        onChange={handleFileUpload}
        id="imageUploadInput"
      />
      {file ? (
        <div className="fc c w100">
          <div className="fr spa w100 mT30">
            <Icon className="clickableIcon" onClick={() => rotatePic("left")}>
              rotate_left
            </Icon>
            <div
              className="imageToUpload"
              style={{
                backgroundImage: `url(${file})`,
                minHeight: min,
                minWidth: min,
              }}
            ></div>
            <Icon className="clickableIcon" onClick={() => rotatePic("right")}>
              rotate_right
            </Icon>
          </div>
          <p className="tac xs thin mT20">
            <b>Warning:</b> Each rotation degrades image quality.
          </p>
          <div className="fr fre w100 mT20">
            <Button onClick={() => saveImageToStorage()} color="primary">
              Upload
            </Button>
            <Button onClick={handleCancelClick} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
      {!file && edit && (
        <div className="fr fre w100 mT20">
          <Button onClick={handleCancelClick} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </div>
      )}
      {loading && <LinearProgress className="w100 mT10" color="secondary" />}
    </div>
  );
};

export default ImageUpload;
