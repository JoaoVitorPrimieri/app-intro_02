import React, { useState, useEffect, useRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../services/api";
import AtividadeList from "./AtividadeList";
import AtividadeForm from "./AtividadeForm";
import AtividadeSrv from "./AtividadeSrv";
import RequisicaoSrv from "../requisicoes/RequisicaoSrv";
import ColaboradorSrv from "../colaboradores/ColaboradorSrv";

import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

function AtividadeCont() {

  const [requisicoes, setRequisicoes] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const toastRef = useRef();
  const initialState = { id: null, titulo: '', descricao: '', dataHora: '', status: '', prazoAtendimento: '', Requisicao: '', Colaborador: '' }
  const [atividade, setAtividade] = useState(initialState)
  const [editando, setEditando] = useState(false)

  useEffect(() => {
    onClickAtualizar(); // ao inicializar execula método para atualizar
    RequisicaoSrv.listar()
    .then((response) => {
      setRequisicoes(response.data);
      toastRef.current.show({
        severity: "success",
        summary: "Requisicoes atualizadas",
        life: 3000,
      });
    })
    .catch((e) => {
      toastRef.current.show({
        severity: "error",
        summary: e.message,
        life: 3000,
      });
    });
    ColaboradorSrv.listar()
    .then((response) => {
      setColaboradores(response.data);
      toastRef.current.show({
        severity: "success",
        summary: "Colaboradores atualizados",
        life: 3000,
      });
    })
    .catch((e) => {
      toastRef.current.show({
        severity: "error",
        summary: e.message,
        life: 3000,
      });
    });
  }, []);
  

  const onClickAtualizar = () => {
    AtividadeSrv.listar()
      .then((response) => {
        setAtividades(response.data);
        toastRef.current.show({
          severity: "success",
          summary: "Atividade atualizado",
          life: 3000,
        });
      })
      .catch((e) => {
        toastRef.current.show({
          severity: "error",
          summary: e.message,
          life: 3000,
        });
      });
  };


  React.useEffect(() => {
    api
      .get("/atividade")
      .then((response) => setAtividades(response.data))
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }, []);
  // operação inserir


  const inserir = () => {
    setAtividade(initialState);
    setEditando(true);
  }
  const cancelar = () => {
    console.log('Cancelou ...');
    setEditando(false);
  }
  const salvar = () => {
    if (atividade._id == null) { // inclussão
      AtividadeSrv.incluir(atividade).then(response => {
        setEditando(false);
        onClickAtualizar();
        toastRef.current.show({ severity: 'success', summary: "Salvou", life: 2000 });
      })
        .catch(e => {
          toastRef.current.show({ severity: 'error', summary: e.message, life: 4000 });
        });
    } else { // alteração
      AtividadeSrv.alterar(atividade).then(response => {
        setEditando(false);
        onClickAtualizar();
        toastRef.current.show({ severity: 'success', summary: "Salvou", life: 2000 });
      })
        .catch(e => {
          toastRef.current.show({ severity: 'error', summary: e.message, life: 4000 });
        });
    }
  }

  const editar = (id) => {
    setAtividade(atividades.filter((atividade) => atividade._id === id)[0]);
    setEditando(true);
  }

  const excluir = (_id) => {
    confirmDialog({
      message: 'Confirma a exclusão?',
      header: 'Confirmação',
      icon: 'pi pi-question',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptClassName: 'p-button-danger',
      accept: () => excluirConfirm(_id)
    });
  }

  const excluirConfirm = (_id) => {

    AtividadeSrv.excluir(_id).then(response => {
      onClickAtualizar();
      toastRef.current.show({
        severity: 'success',
        summary: "Excluído", life: 2000
      });
    })
      .catch(e => {
        toastRef.current.show({
          severity: 'error',
          summary: e.message, life: 4000
        });
      });
  }

  if (!editando) {
    return (
      <div className="App">
        <Toast ref={toastRef} />
        <ConfirmDialog />
        <AtividadeList
          atividades={atividades}
          inserir={inserir}
          editar={editar}
          excluir={excluir}
          onClickAtualizar={onClickAtualizar}
          />

        <Toast ref={toastRef} />

      </div>
    );  
  } else {
    return (
      <div className="App">
        <AtividadeForm
          atividade={atividade}
          colaboradores={colaboradores}
          requisicoes={requisicoes}
          setAtividade={setAtividade}
          salvar={salvar}
          cancelar={cancelar} />
        <Toast ref={toastRef} />

      </div>
    );
  }
}

export default AtividadeCont;
