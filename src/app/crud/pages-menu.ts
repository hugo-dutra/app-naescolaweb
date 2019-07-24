import { NbMenuItem } from '@nebular/theme';
import { Title } from '@angular/platform-browser';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Cadastros',
    children: [
      {
        title: 'Gestão',
        icon: 'layout-outline',
        children: [
          {
            title: 'Diretor',
            link: '/layout/stepper',
          },
          {
            title: 'Escola',
            link: '/layout/list',
          },
          {
            title: 'Mensalidade',
            link: '/layout/infinite-list',
          },
          {
            title: 'Perfil de usuário',
            link: '/layout/accordion',
          },
          {
            title: 'Rede de ensino',
            link: '/layout/tabs',
          },
          {
            title: 'Região',
            link: '/layout/tabs',
          },
          {
            title: 'Usuário',
            link: '/layout/tabs',
          },
        ],
      },
      {
        title: 'Pedagógico',
        icon: 'layout-outline',
        children: [
          {
            title: 'Área do conhecimento',
            link: '/listar-area-conhecimento',
          },
          {
            title: 'Diários do professor',
            link: '/layout/list',
          },
          {
            title: 'Disciplina',
            link: '/layout/infinite-list',
          },
          {
            title: 'Etapa do ensino',
            link: '/layout/accordion',
          },
          {
            title: 'Período letivo',
            link: '/layout/tabs',
          },
        ],
      },
      {
        title: 'Secretaria',
        icon: 'layout-outline',
        children: [
          {
            title: 'Diário',
            link: '/layout/stepper',
          },
          {
            title: 'Enturmar estudante',
            link: '/layout/list',
          },
          {
            title: 'Estudante',
            link: '/layout/infinite-list',
          },
          {
            title: 'Professor',
            link: '/layout/accordion',
          },
          {
            title: 'Série',
            link: '/layout/tabs',
          },
          {
            title: 'Turma',
            link: '/layout/tabs',
          },
          {
            title: 'Turno',
            link: '/layout/tabs',
          },
        ],
      },
      {
        title: 'Assistência',
        icon: 'layout-outline',
        children: [
          {
            title: 'Aplicativo',
            link: '/layout/stepper',
          },
          {
            title: 'Cartão de acesso',
            link: '/layout/list',
          },
          {
            title: 'Comunicados',
            link: '/layout/infinite-list',
          },
          {
            title: 'Entidade estudantil',
            link: '/layout/accordion',
          },
          {
            title: 'Gerenciar alertas de ocorrência',
            link: '/gerenciar-alerta-ocorrencia',
          },
          {
            title: 'Observação',
            link: '/layout/tabs',
          },
          {
            title: 'Ocorrência',
            link: '/layout/tabs',
          },
          {
            title: 'Portaria',
            link: '/layout/tabs',
          },
          {
            title: 'Receber alertas de ocorrência',
            link: '/layout/tabs',
          },
          {
            title: 'Saída antecipada',
            link: '/layout/tabs',
          },
          {
            title: 'Tipo de ocorrência disciplinar',
            link: '/layout/tabs',
          },
        ],
      },
    ]
  },
  {
    title: 'Relatórios',
    children: [
      {
        title: 'Layout',
        icon: 'layout-outline',
        children: [
          {
            title: 'Stepper',
            link: '/layout/stepper',
          },
          {
            title: 'List',
            link: '/layout/list',
          },
          {
            title: 'Infinite List',
            link: '/layout/infinite-list',
          },
          {
            title: 'Accordion',
            link: '/layout/accordion',
          },
          {
            title: 'Tabs',
            pathMatch: 'prefix',
            link: '/layout/tabs',
          },
        ],
      },
    ]
  },
  {
    title: 'Sugestões',
    link: ''
  }
];
