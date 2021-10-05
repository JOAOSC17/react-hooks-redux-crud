import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTutorial, deleteTutorial } from "../actions/tutorials";
import TutorialDataService from "../services/TutorialService";

const Tutorial = (props) => {
  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false
  };
  const [currentTutorial, setCurrentTutorial] = useState(initialTutorialState);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const getTutorial = id => {
    TutorialDataService.get(id)
      .then(response => {
        setCurrentTutorial(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getTutorial(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentTutorial({ ...currentTutorial, [name]: value });
  };

  const updateStatus = status => {
    const data = {
      id: currentTutorial.id,
      title: currentTutorial.title,
      description: currentTutorial.description,
      published: status
    };

    dispatch(updateTutorial(currentTutorial.id, data))
      .then(response => {
        console.log(response);

        setCurrentTutorial({ ...currentTutorial, published: status });
        setMessage("O Status Foi Atualizado com Sucesso!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const updateContent = () => {
    dispatch(updateTutorial(currentTutorial.id, currentTutorial))
      .then(response => {
        console.log(response);

        setMessage("O Tutorial Foi Atualizado com Sucesso!");
        setTimeout(function(){props.history.push("/tutorials"); }, 1000);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const removeTutorial = () => {
    dispatch(deleteTutorial(currentTutorial.id))
      .then(() => {
        setMessage("O Tutorial Foi Removido com Sucesso!");
        setTimeout(function(){props.history.push("/tutorials"); }, 1000);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentTutorial ? (
        <div className="edit-form">
          <h4>Tutorial</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">Título</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={currentTutorial.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={currentTutorial.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {currentTutorial.published ? "Publicado" : "Pendente"}
            </div>
          </form>
<div className="d-flex justify-content-between">
          {currentTutorial.published ? (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => updateStatus(false)}
            >
              Pendente
            </button>
          ) : (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => updateStatus(true)}
            >
              Publicado
            </button>
          )}

          <button className="btn btn-sm btn-danger" onClick={removeTutorial}>
            Deletar
          </button>

          <button
            type="submit"
            className="btn btn-sm btn-success"
            onClick={updateContent}
          >
            Atualizar
          </button>
          </div>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Carregando...</p>
        </div>
      )}
    </div>
  );
};

export default Tutorial;