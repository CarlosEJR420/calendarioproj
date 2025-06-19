import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// Tipagem dos eventos
type EventType = "aniversario" | "festejo" | "finados" | "outro";

interface EventData {
  nome: string;
  autor: string;
  link?: string;
  tipo: EventType;
  dataNascimento?: string;
  hinario?: string;
  quantidadeHinos?: number;
  observacao?: string;
  horario?: string;
  farda?: string;
}

interface EventsByMonth {
  [mes: number]: {
    [dia: number]: EventData;
  };
}

// Constantes reutilizáveis
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// Cores padrão para tipos de eventos
const CORES_EVENTOS: Record<EventType, string> = {
  aniversario: "#2ECC71",
  festejo: "#3498DB",
  finados: "#7F8C8D",
  outro: "#9B59B6",
};

// Dados iniciais dos eventos
const EVENTOS_INICIAIS: EventsByMonth = {
  // JANEIRO
  0: {
    3: {
      nome: "Caminhada no Jardim da Natureza",
      autor: "Hinários Nova Era e outros",
      tipo: "festejo",
      hinario: "Nova Era e outros",
      observacao: "Farda branca",
    },
    5: {
      nome: "Dia de Reis",
      autor: "Hinário do Mestre Irineu",
      tipo: "festejo",
      hinario: "Mestre Irineu",
      horario: "19 horas",
      farda: "branca",
    },
    7: {
      nome: "Aniversário do Pd Alfredo",
      autor: "Hinário do Pd Sebastião",
      tipo: "aniversario",
      hinario: "Pd Sebastião",
      horario: "10 horas",
      farda: "branca",
    },
    9: {
      nome: "Aniversário da Md Cristina",
      autor: "Hinário do Mestre Irineu",
      tipo: "aniversario",
      hinario: "Mestre Irineu",
      horario: "10 horas",
      farda: "azul",
    },
    19: {
      nome: "São Sebastião e passagem do Pd Sebastião",
      autor: "Hinário do Pd Sebastião e Missa",
      tipo: "festejo",
      hinario: "Pd Sebastião",
      horario: "19 horas",
      farda: "branca",
    },
    26: {
      nome: "Passagem da Md Cristina",
      autor: "Hinário da Md Cristina e outros",
      tipo: "festejo",
      hinario: "Md Cristina e outros",
      horario: "19 horas",
      farda: "azul",
    },
  },
  // FEVEREIRO
  1: {
    2: {
      nome: "Dia de Iemanjá",
      autor: "Trabalho de Mulheres na Igreja",
      tipo: "festejo",
      hinario: "Md Rita e outros",
      observacao: "Roupa branca",
    },
  },
  // MARÇO
  2: {
    3: {
      nome: "Aniversário da D. Zilda",
      autor: "Hinário da Gecila",
      tipo: "aniversario",
      hinario: "Gecila",
      horario: "19 horas",
      farda: "azul",
    },
    18: {
      nome: "São José",
      autor: "Hinário do pd Alfredo",
      tipo: "festejo",
      hinario: "Pd Alfredo",
      farda: "branca",
    },
    23: {
      nome: "Passagem do Pd Corrente",
      autor: "Hinário do Pd Corrente",
      tipo: "festejo",
      hinario: "Pd Corrente",
      horario: "19 horas",
      farda: "azul",
    },
  },
  // ABRIL
  3: {
    7: {
      nome: "Aniversário do S. Bernaldo e Raquel",
      autor: "Hinário do Pd Sebastião",
      tipo: "aniversario",
      hinario: "Pd Sebastião",
      farda: "branca",
    },
    13: {
      nome: "Semana Santa - Quinta-feira",
      autor: "Hinário de Finados",
      tipo: "festejo",
      hinario: "Finados",
      horario: "19 horas",
      farda: "azul",
    },
  },
  // MAIO
  4: {
    14: {
      nome: "Dia das Mães",
      autor: "Hinários Mds Julia, Rita e Cristina",
      tipo: "festejo",
      hinario: "Mds Julia, Rita e Cristina",
      horario: "10 horas",
      farda: "branca",
    },
    20: {
      nome: "Aniversário de casamento do Pd Alfredo",
      autor: "Hinário do pd Alfredo",
      tipo: "aniversario",
      hinario: "Pd Alfredo",
      horario: "19 horas",
      farda: "branca",
    },
    25: {
      nome: "Aniversário da Rute",
      autor: "Hinários Roberval e Odemir",
      tipo: "aniversario",
      hinario: "Roberval e Odemir",
      horario: "19 horas",
      farda: "azul",
    },
  },
  // JUNHO
  5: {
    12: {
      nome: "Santo Antonio",
      autor: "Hinário Maria Brilhante",
      tipo: "festejo",
      hinario: "Maria Brilhante",
      horario: "19 horas",
      farda: "branca",
    },
    23: {
      nome: "São João",
      autor: "Mestre Irineu",
      tipo: "festejo",
      hinario: "Mestre Irineu",
      horario: "19 horas",
      farda: "branca",
    },
    25: {
      nome: "Aniversário da Md Rita",
      autor: "Hinário do Pd Sebastião",
      tipo: "aniversario",
      hinario: "Pd Sebastião",
      horario: "10 horas",
      farda: "branca",
    },
    28: {
      nome: "São Pedro",
      autor: "Hinário do Pd Alfredo",
      tipo: "festejo",
      hinario: "Pd Alfredo",
      horario: "19 horas",
      farda: "branca",
    },
  },
  // JULHO
  6: {
    3: {
      nome: "Caminhada no Jardim da Natureza",
      autor: "Hinário Nova Era e outros",
      tipo: "festejo",
      hinario: "Nova Era e outros",
    },
    6: {
      nome: "Passagem do Mestre Irineu",
      autor: "Hinário do Teteo",
      tipo: "festejo",
      hinario: "Teteo",
      horario: "19 horas",
      farda: "branca",
    },
    11: {
      nome: "Aniversário da Tete",
      autor: "Hinário da Tete",
      tipo: "aniversario",
      hinario: "Tete",
      horario: "19 horas",
      farda: "azul",
    },
    19: {
      nome: "Aniversário do Pd Wilson",
      autor: "Hinário do Pd Sebastião",
      tipo: "aniversario",
      hinario: "Pd Sebastião",
      horario: "10 horas",
      farda: "branca",
    },
    22: {
      nome: "Dia de Santa Madalena",
      autor: "Hinário da Sonia",
      tipo: "festejo",
      hinario: "Sonia",
      horario: "19 horas",
      farda: "azul",
    },
  },
  // AGOSTO
  7: {
    13: {
      nome: "Dia dos Pais",
      autor: "Hinário do Pd Sebastião",
      tipo: "festejo",
      hinario: "Pd Sebastião",
      horario: "10 horas",
      farda: "branca",
    },
    22: {
      nome: "Aniversário da Silvia",
      autor: "Segunda parte do hinário do Pd Alfredo",
      tipo: "aniversario",
      hinario: "Pd Alfredo (2ª parte)",
      horario: "19 horas",
      farda: "azul",
    },
  },
  // SETEMBRO
  8: {
    29: {
      nome: "São Miguel e aniversário do Pd Corrente",
      autor: "Hinários Pd Corrente, Dalvina e Lucio",
      tipo: "festejo",
      hinario: "Pd Corrente, Dalvina e Lucio",
      horario: "19 horas",
      farda: "azul",
    },
  },
  // OUTUBRO
  9: {
    6: {
      nome: "Aniversário do Pd Sebastião",
      autor: "Hinário do Mestre Irineu",
      tipo: "aniversario",
      hinario: "Mestre Irineu",
      horario: "19 horas",
      farda: "branca",
    },
    29: {
      nome: "Aniversário do Pd Mario",
      autor: "Hinário da D. Regiana",
      tipo: "aniversario",
      hinario: "D. Regiana",
      horario: "19 horas",
      farda: "azul",
    },
  },
  // NOVEMBRO
  10: {
    1: {
      nome: "Finados",
      autor: "Hinário dos Finados e Missa",
      tipo: "finados",
      hinario: "Finados",
      farda: "azul",
    },
    9: {
      nome: "Passagem da Md Tete",
      autor: "Hinário da Md Tete",
      tipo: "festejo",
      hinario: "Md Tete",
      horario: "19 horas",
      farda: "azul",
    },
  },
  // DEZEMBRO
  11: {
    7: {
      nome: "Virgem da Conceição",
      autor: "Hinário do Mestre Irineu",
      tipo: "festejo",
      hinario: "Mestre Irineu",
      horario: "19 horas",
      farda: "branca",
    },
    14: {
      nome: "Aniversário do Mestre Irineu",
      autor: "Hinário do Pd Sebastião",
      tipo: "aniversario",
      hinario: "Pd Sebastião",
      horario: "19 horas",
      farda: "branca",
    },
    24: {
      nome: "Natal",
      autor: "Hinário do mestre Irineu",
      tipo: "festejo",
      hinario: "Mestre Irineu",
      horario: "19 horas",
      farda: "branca",
    },
    29: {
      nome: "Aniversário da Md Julia",
      autor: "Hinário do Pd Sebastião (4 em 4 anos) ou Md Julia e Nova Jerusalem",
      tipo: "aniversario",
      hinario: "Varia conforme o ano",
      horario: "10 horas (4 em 4 anos) ou 19 horas",
      farda: "branca (4 em 4 anos) ou azul",
      observacao:
        "De 4 em 4 anos: hinário do Pd Sebastião às 10 horas com farda branca. Nos outros anos: hinário da Md Julia e Nova Jerusalem às 19 horas com farda azul",
    },
    31: {
      nome: "Ano Novo",
      autor: "Hinário do Pd Alfredo",
      tipo: "festejo",
      hinario: "Pd Alfredo",
      horario: "19 horas",
      farda: "branca",
    },
  },
};

// Função que monta os dias do mês no formato de calendário
const getDiasDoMes = (mesIndex: number, ano: number) => {
  const primeiroDia = new Date(ano, mesIndex, 1).getDay();
  const ultimoDia = new Date(ano, mesIndex + 1, 0).getDate();

  const dias = [];
  let linha = new Array(primeiroDia).fill("");

  for (let dia = 1; dia <= ultimoDia; dia++) {
    linha.push(dia);
    if (linha.length === 7) {
      dias.push(linha);
      linha = [];
    }
  }

  if (linha.length > 0) {
    while (linha.length < 7) linha.push("");
    dias.push(linha);
  }

  while (dias.length < 6) {
    dias.push(new Array(7).fill(""));
  }

  return dias;
};

const CalendarioDaimista = () => {
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [modalVisible, setModalVisible] = useState(false);
  const [addEventModalVisible, setAddEventModalVisible] = useState(false);
  const [selectedDayInfo, setSelectedDayInfo] = useState<EventData | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [eventos, setEventos] = useState<EventsByMonth>(EVENTOS_INICIAIS);

  const [novoEvento, setNovoEvento] = useState<Partial<EventData>>({
    tipo: "festejo",
    nome: "",
    autor: "",
    link: "",
    dataNascimento: "",
    hinario: "",
    quantidadeHinos: undefined,
    observacao: "",
  });

  const ano = new Date().getFullYear();
  const dias = getDiasDoMes(mesSelecionado, ano);

  const handleDayPress = (dia: number) => {
    const info = eventos[mesSelecionado]?.[dia];
    if (info) {
      setSelectedDayInfo(info);
      setSelectedDay(dia);
      setModalVisible(true);
    } else {
      setSelectedDay(dia);
      resetNovoEvento();
      setAddEventModalVisible(true);
    }
  };

  const resetNovoEvento = () => {
    setNovoEvento({
      tipo: "festejo",
      nome: "",
      autor: "",
      link: "",
      dataNascimento: "",
      hinario: "",
      quantidadeHinos: undefined,
      observacao: "",
    });
  };

  const validarEvento = (): boolean => {
    if (!novoEvento.nome || !novoEvento.autor) {
      Alert.alert("Campos obrigatórios", "Nome e Autor são campos obrigatórios");
      return false;
    }
    return true;
  };

  const adicionarEvento = () => {
    if (!selectedDay || !validarEvento()) return;

    const eventoCompleto: EventData = {
      nome: novoEvento.nome || "Novo Evento",
      autor: novoEvento.autor || "",
      tipo: novoEvento.tipo || "festejo",
      ...(novoEvento.link && { link: novoEvento.link }),
      ...(novoEvento.dataNascimento && { dataNascimento: novoEvento.dataNascimento }),
      ...(novoEvento.hinario && { hinario: novoEvento.hinario }),
      ...(novoEvento.quantidadeHinos && { quantidadeHinos: novoEvento.quantidadeHinos }),
      ...(novoEvento.observacao && { observacao: novoEvento.observacao }),
      ...(novoEvento.horario && { horario: novoEvento.horario }),
      ...(novoEvento.farda && { farda: novoEvento.farda }),
    };

    setEventos((prev) => {
      const mesAtual = prev[mesSelecionado] || {};
      return {
        ...prev,
        [mesSelecionado]: {
          ...mesAtual,
          [selectedDay]: eventoCompleto,
        },
      };
    });

    setAddEventModalVisible(false);
    setSelectedDayInfo(eventoCompleto);
    setModalVisible(true);
    resetNovoEvento();
  };

  const removerEvento = () => {
    if (!selectedDay) return;

    Alert.alert(
      "Confirmar",
      "Deseja realmente remover este evento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          onPress: () => {
            setEventos((prev) => {
              const mesAtual = { ...prev[mesSelecionado] };
              delete mesAtual[selectedDay];

              return {
                ...prev,
                [mesSelecionado]: mesAtual,
              };
            });

            setModalVisible(false);
            setSelectedDayInfo(null);
          },
          style: "destructive",
        },
      ]
    );
  };

  const abrirLink = async (url?: string) => {
    if (!url) {
      Alert.alert("Aviso", "Nenhum link disponível para abrir");
      return;
    }

    try {
      // Verifica se podemos abrir o link
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        // Tenta abrir o link
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Link não suportado",
          `Não foi possível abrir o link: ${url}`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Erro ao abrir link:", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao tentar abrir o link",
        [{ text: "OK" }]
      );
    }
  };

  const renderModalDetalhes = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedDayInfo?.nome}</Text>
          
          <View style={styles.modalInfoRow}>
            <Text style={styles.modalLabel}>Autor:</Text>
            <Text style={styles.modalText}>{selectedDayInfo?.autor}</Text>
          </View>
          
          {selectedDayInfo?.tipo === "aniversario" && selectedDayInfo?.dataNascimento && (
            <View style={styles.modalInfoRow}>
              <Text style={styles.modalLabel}>Data de Nascimento:</Text>
              <Text style={styles.modalText}>{selectedDayInfo.dataNascimento}</Text>
            </View>
          )}
          
          {selectedDayInfo?.hinario && (
            <View style={styles.modalInfoRow}>
              <Text style={styles.modalLabel}>Hinário:</Text>
              <Text style={styles.modalText}>{selectedDayInfo.hinario}</Text>
            </View>
          )}
          
          {selectedDayInfo?.quantidadeHinos && (
            <View style={styles.modalInfoRow}>
              <Text style={styles.modalLabel}>Quantidade de Hinos:</Text>
              <Text style={styles.modalText}>{selectedDayInfo.quantidadeHinos}</Text>
            </View>
          )}
          
          {selectedDayInfo?.horario && (
            <View style={styles.modalInfoRow}>
              <Text style={styles.modalLabel}>Horário:</Text>
              <Text style={styles.modalText}>{selectedDayInfo.horario}</Text>
            </View>
          )}
          
          {selectedDayInfo?.farda && (
            <View style={styles.modalInfoRow}>
              <Text style={styles.modalLabel}>Farda:</Text>
              <Text style={styles.modalText}>{selectedDayInfo.farda}</Text>
            </View>
          )}
          
          {selectedDayInfo?.observacao && (
            <View style={styles.modalInfoRow}>
              <Text style={styles.modalLabel}>Observação:</Text>
              <Text style={styles.modalText}>{selectedDayInfo.observacao}</Text>
            </View>
          )}
          
          {selectedDayInfo?.link && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => abrirLink(selectedDayInfo.link)}
            >
              <Text style={styles.linkButtonText}>Abrir Link</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={removerEvento}
            >
              <Text style={styles.modalButtonText}>Remover</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderModalAdicionarEvento = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addEventModalVisible}
      onRequestClose={() => setAddEventModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Adicionar Evento - Dia {selectedDay} de {MESES[mesSelecionado]}
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tipo de Evento:</Text>
            <Picker
              selectedValue={novoEvento.tipo}
              onValueChange={(value) =>
                setNovoEvento({ ...novoEvento, tipo: value as EventType })
              }
              style={styles.inputPicker}
            >
              <Picker.Item label="Festejo" value="festejo" />
              <Picker.Item label="Aniversário" value="aniversario" />
              <Picker.Item label="Finados" value="finados" />
              <Picker.Item label="Outro" value="outro" />
            </Picker>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nome*:</Text>
            <TextInput
              style={styles.input}
              value={novoEvento.nome}
              onChangeText={(text) => setNovoEvento({ ...novoEvento, nome: text })}
              placeholder="Nome do evento"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Autor*:</Text>
            <TextInput
              style={styles.input}
              value={novoEvento.autor}
              onChangeText={(text) => setNovoEvento({ ...novoEvento, autor: text })}
              placeholder="Autor do evento"
            />
          </View>
          
          {novoEvento.tipo === "aniversario" && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Data de Nascimento:</Text>
              <TextInput
                style={styles.input}
                value={novoEvento.dataNascimento}
                onChangeText={(text) =>
                  setNovoEvento({ ...novoEvento, dataNascimento: text })
                }
                placeholder="DD/MM/AAAA"
              />
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Hinário:</Text>
            <TextInput
              style={styles.input}
              value={novoEvento.hinario}
              onChangeText={(text) => setNovoEvento({ ...novoEvento, hinario: text })}
              placeholder="Hinário utilizado"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Quantidade de Hinos:</Text>
            <TextInput
              style={styles.input}
              value={novoEvento.quantidadeHinos?.toString()}
              onChangeText={(text) =>
                setNovoEvento({
                  ...novoEvento,
                  quantidadeHinos: text ? parseInt(text) : undefined,
                })
              }
              keyboardType="numeric"
              placeholder="Número de hinos"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Horário:</Text>
            <TextInput
              style={styles.input}
              value={novoEvento.horario}
              onChangeText={(text) => setNovoEvento({ ...novoEvento, horario: text })}
              placeholder="Horário do evento"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Farda:</Text>
            <TextInput
              style={styles.input}
              value={novoEvento.farda}
              onChangeText={(text) => setNovoEvento({ ...novoEvento, farda: text })}
              placeholder="Tipo de farda"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Link:</Text>
            <TextInput
              style={styles.input}
              value={novoEvento.link}
              onChangeText={(text) => setNovoEvento({ ...novoEvento, link: text })}
              placeholder="URL relacionada"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Observação:</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={novoEvento.observacao}
              onChangeText={(text) => setNovoEvento({ ...novoEvento, observacao: text })}
              placeholder="Observações adicionais"
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setAddEventModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={adicionarEvento}
            >
              <Text style={styles.modalButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderDiaCelula = (dia: number | string, index: number) => {
    if (typeof dia !== "number") {
      return (
        <View key={index} style={styles.dayCell}>
          <Text style={styles.dayText}></Text>
        </View>
      );
    }

    const evento = eventos[mesSelecionado]?.[dia];
    const corEvento = evento ? CORES_EVENTOS[evento.tipo] : undefined;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayCell,
          evento && {
            backgroundColor: `${corEvento}20`,
            borderColor: corEvento,
          },
        ]}
        onPress={() => handleDayPress(dia)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dayText,
            evento && {
              color: corEvento,
              fontWeight: "bold",
            },
          ]}
        >
          {dia}
        </Text>
        {evento && (
          <View
            style={[
              styles.eventIndicator,
              { backgroundColor: corEvento },
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/images/daime.jpg")}
            style={styles.iconImage}
          />
          <View>
            <Text style={styles.title}>
              <Text style={styles.azul}>Calendário </Text>
              <Text style={styles.verde}>Daimista</Text>
            </Text>
            <Text style={styles.subTitle}>
              Eventos e celebrações espirituais. ℹ️
            </Text>
          </View>
        </View>

        <View style={styles.monthSelectorContainer}>
          <Text style={styles.monthLabel}>
            {MESES[mesSelecionado]} {ano}
          </Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={mesSelecionado}
              onValueChange={(itemValue) => setMesSelecionado(Number(itemValue))}
              style={styles.picker}
              dropdownIconColor="#2C3E50"
            >
              {MESES.map((mes, index) => (
                <Picker.Item key={index} label={mes} value={index} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.weekRow}>
            {DIAS_SEMANA.map((dia, index) => (
              <Text key={index} style={styles.dayLabel}>
                {dia}
              </Text>
            ))}
          </View>

          {dias.map((semana, i) => (
            <View key={i} style={styles.weekRow}>
              {semana.map((dia, j) => renderDiaCelula(dia, j))}
            </View>
          ))}
        </View>

        {renderModalDetalhes()}
        {renderModalAdicionarEvento()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  azul: {
    color: "#3498DB",
  },
  verde: {
    color: "#2ECC71",
  },
  subTitle: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  monthSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  monthLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#3498DB",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    backgroundColor: "#ECF0F1",
    width: 150,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#2C3E50",
  },
  calendarContainer: {
    width: "100%",
    backgroundColor: "#ECF0F1",
    borderRadius: 12,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayLabel: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontWeight: "bold",
    color: "#3498DB",
    fontSize: 14,
    paddingVertical: 6,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  dayText: {
    fontSize: 16,
    color: "#2C3E50",
  },
  eventIndicator: {
    position: "absolute",
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInfoRow: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  modalLabel: {
    fontWeight: "bold",
    color: "#2C3E50",
    marginRight: 5,
  },
  modalText: {
    color: "#2C3E50",
    flexShrink: 1,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  closeButton: {
    backgroundColor: "#3498DB",
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
  },
  cancelButton: {
    backgroundColor: "#95A5A6",
  },
  saveButton: {
    backgroundColor: "#2ECC71",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  linkButton: {
    backgroundColor: "#9B59B6",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  linkButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    color: "#2C3E50",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#FFFFFF",
    color: "#2C3E50",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputPicker: {
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
});

export default CalendarioDaimista;