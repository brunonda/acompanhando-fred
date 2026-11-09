---
name: create-angular-bulma-project
description: >-
  Cria e configura projetos Angular modernos com estilização e componentes baseados no framework Bulma CSS.
  Utilize esta skill sempre que o usuário solicitar a criação de um novo projeto Angular com Bulma,
  solicitar componentes reutilizáveis Bulma no Angular, ou fornecer o template de especificação do projeto preenchido.
---

# Skill: Criação de Projeto Angular + Bulma CSS

Esta skill guia a criação, configuração e estruturação de novos projetos em **Angular** (v17+ com standalone components, signals e novo control flow `@if` / `@for`) estilizados com **Bulma CSS** (v1.0+).

---

## 📋 Sumário
1. [Template de Especificação do Projeto (Para preenchimento manual)](#-template-de-especificação-do-projeto)
2. [Fluxo de Execução da Skill](#-fluxo-de-execução-da-skill)
3. [Passo a Passo de Instalação e Configuração](#-passo-a-passo-de-instalação-e-configuração)
4. [Componentes Bulma Reutilizáveis (Angular Standalone + Signals)](#-componentes-bulma-reutilizáveis)
5. [Boas Práticas de Arquitetura](#-boas-práticas-de-arquitetura)

---

## 📝 Template de Especificação do Projeto

> **Instruções para o usuário:**  
> Copie o bloco abaixo, preencha com os dados do seu projeto e envie no chat para que o agente crie e configure tudo automaticamente de acordo com suas preferências.

```markdown
### 🚀 Especificação do Novo Projeto Angular + Bulma

1. **Identificação do Projeto**
   - **Nome do Projeto (slug/pasta):** `acompanhando-fred`
   - **Título da Aplicação:** `Acompanhando Fred`
   - **Descrição breve:** `Sistema de acompanhamento do quadro do Frederico`
   - **Versão do Angular:** `latest`
   - **Usar SSR (Server-Side Rendering)?** `[ ] Sim  [x] Não`

2. **Identidade Visual & Bulma**
   - **Cores Principais:**
     - Primary: `#00d1b2` (padrão Bulma teal) ou customizada: ` `
     - Link / Info / Success / Warning / Danger: `Padrão Bulma`
   - **Suporte a Dark Mode (Tema Escuro)?** `[x] Sim (data-theme="dark")  [ ] Não`
   - **Biblioteca de Ícones:** `[x] Font Awesome  [ ] Lucide Icons  [ ] Google Material Symbols  [ ] Nenhuma`

3. **Layout Base Desejado**
   - **Navbar Superior:** `[x] Sim  [ ] Não`
     - Logo/Título: `Sim`
     - Menu Responsivo (Burger menu): `Sim`
     - Links iniciais: `Home`
   - **Sidebar (Menu Lateral):** `[ ] Sim  [x] Não`
   - **Footer:** `[x] Sim  [ ] Não`

4. **Páginas / Rotas Iniciais**
   - Rota 1: `path: ''` -> `HomeComponent` (Hero section com chamada para ação e destaques em cards)

5. **Componentes Bulma Necessários Inicialmente**
   - `[x]` Modal Reativo (com backdrop e controle via Signal)
   - `[x]` Notificação / Toast (is-success, is-danger, auto-dismiss)
   - `[x]` Navbar com hambúrguer reativo
   - `[x]` Card padrão reutilizável
   - `[ ]` Tabela com paginação
   - `[ ]` Tabs (Abas de navegação)
   - `[ ]` Dropdown reativo

6. **Dependências Extras**
   - `[ ]` Ngx-Mask (Máscaras de formulário)
   - `[ ]` Chart.js / ng2-charts (Gráficos)
   - `[ ]` Outras: ` `
```

---

## ⚡ Fluxo de Execução da Skill

Quando o usuário fornecer o template preenchido ou pedir para iniciar um projeto:

1. **Validação das Definições**:
   - Confirmar o nome da pasta e se deve ser gerado no diretório atual ou em um novo subdiretório.
   - Verificar as rotas e componentes selecionados.
2. **Geração do Projeto**:
   - Executar `npx @angular/cli@latest new <nome-projeto> --routing --style=scss --ssr=false --skip-git=false`
3. **Instalação das Dependências de Estilo**:
   - `npm install bulma @fortawesome/fontawesome-free`
4. **Configuração dos Estilos Globais**:
   - Importar o Bulma e Font Awesome em `src/styles.scss`.
   - Configurar variáveis SCSS caso o usuário tenha escolhido cores personalizadas.
5. **Criação da Arquitetura de Pastas**:
   - `core/`, `shared/components/`, `layout/`, `features/`.
6. **Implementação dos Componentes e Rotas**:
   - Criar os componentes compartilhados Bulma com Standalone Components e Angular Signals.
   - Criar o layout base (`navbar`, `footer`) e as rotas definidas.
7. **Teste e Validação**:
   - Executar `npm run build` ou testar a compilação do TypeScript para garantir que não há erros de sintaxe ou dependências quebradas.

---

## 🛠️ Passo a Passo de Instalação e Configuração

### 1. Criar o Projeto Angular
```bash
npx @angular/cli new acompanhando-fred --routing --style=scss --ssr=false
cd acompanhando-fred
```

### 2. Instalar Bulma e Font Awesome
```bash
npm install bulma @fortawesome/fontawesome-free
```

### 3. Configurar `src/styles.scss`
Configuração pronta com suporte a personalização de variáveis e tema escuro:

```scss
// 1. Importação do Font Awesome
@use "@fortawesome/fontawesome-free/css/all.min.css";

// 2. Customização opcional de variáveis do Bulma (se necessário antes de carregar o Bulma)
// @use "bulma/sass/utilities" with (
//   $primary: #00d1b2
// );

// 3. Importação do Bulma CSS
@use "bulma/css/bulma.min.css";

// 4. Estilos globais adicionais
html, body {
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1 0 auto;
}

footer.footer {
  flex-shrink: 0;
}
```

---

## 🧩 Componentes Bulma Reutilizáveis

Como o Bulma é um framework puramente CSS (sem JavaScript próprio), todo o dinamismo (abrir/fechar modais, alternar menus, notificações) deve ser controlado reativamente pelo Angular através de **Signals** e `[class.is-active]`.

### 1. Navbar Reativa (`src/app/layout/navbar/navbar.component.ts`)

```typescript
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar is-primary is-spaced" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item has-text-weight-bold is-size-5" routerLink="/">
          <span class="icon mr-2"><i class="fas fa-cube"></i></span>
          Meu Projeto
        </a>

        <a
          role="button"
          class="navbar-burger"
          [class.is-active]="isMenuOpen()"
          aria-label="menu"
          [attr.aria-expanded]="isMenuOpen()"
          (click)="toggleMenu()"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" [class.is-active]="isMenuOpen()">
        <div class="navbar-start">
          <a class="navbar-item" routerLink="/" routerLinkActive="is-active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">
            <span class="icon"><i class="fas fa-home"></i></span>
            <span>Home</span>
          </a>
          <a class="navbar-item" routerLink="/dashboard" routerLinkActive="is-active" (click)="closeMenu()">
            <span class="icon"><i class="fas fa-chart-pie"></i></span>
            <span>Dashboard</span>
          </a>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <button class="button is-light" (click)="toggleTheme()">
                <span class="icon">
                  <i class="fas" [class.fa-moon]="!isDark()" [class.fa-sun]="isDark()"></i>
                </span>
              </button>
              <a class="button is-light" routerLink="/login" (click)="closeMenu()">
                <strong>Entrar</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  isMenuOpen = signal(false);
  isDark = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  toggleTheme() {
    this.isDark.update(dark => {
      const next = !dark;
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      return next;
    });
  }
}
```

---

### 2. Modal Reutilizável (`src/app/shared/components/modal/modal.component.ts`)

```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div class="modal is-active">
        <div class="modal-background" (click)="onClose()"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">{{ title() }}</p>
            <button class="delete" aria-label="close" (click)="onClose()"></button>
          </header>
          <section class="modal-card-body">
            <ng-content></ng-content>
          </section>
          <footer class="modal-card-foot is-justify-content-flex-end">
            <ng-content select="[modal-actions]"></ng-content>
            <button class="button" (click)="onClose()">Fechar</button>
          </footer>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  isOpen = input<boolean>(false);
  title = input<string>('Modal');
  closed = output<void>();

  onClose() {
    this.closed.emit();
  }
}
```

---

### 3. Serviço e Componente de Notificação / Toast

#### `src/app/core/services/notification.service.ts`
```typescript
import { Injectable, signal } from '@angular/core';

export interface AppNotification {
  id: number;
  message: string;
  type?: 'is-primary' | 'is-link' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger';
  durationMs?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private nextId = 1;
  notifications = signal<AppNotification[]>([]);

  show(message: string, type: AppNotification['type'] = 'is-info', durationMs = 4000) {
    const id = this.nextId++;
    const notification: AppNotification = { id, message, type, durationMs };
    
    this.notifications.update(list => [...list, notification]);

    if (durationMs > 0) {
      setTimeout(() => this.dismiss(id), durationMs);
    }
  }

  dismiss(id: number) {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }
}
```

#### `src/app/shared/components/notification-container/notification-container.component.ts`
```typescript
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  template: `
    <div class="notification-container">
      @for (item of notificationService.notifications(); track item.id) {
        <div class="notification {{ item.type || 'is-info' }} is-light">
          <button class="delete" (click)="notificationService.dismiss(item.id)"></button>
          {{ item.message }}
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
      width: calc(100% - 3rem);
    }
    .notification {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      margin-bottom: 0 !important;
    }
  `]
})
export class NotificationContainerComponent {
  notificationService = inject(NotificationService);
}
```

---

## 🏗️ Boas Práticas de Arquitetura

1. **Standalone Components como Padrão**: Não use `NgModule` a menos que haja restrição explícita legada. Importe apenas o que cada componente usa (`RouterLink`, `ReactiveFormsModule`, etc.).
2. **Signals para Gerenciamento de Estado de UI**:
   - Controle de menus: `isMenuOpen = signal(false);`
   - Modais: `isModalOpen = signal(false);`
   - Tabs ativas: `activeTab = signal('tab1');`
3. **Novo Control Flow**:
   - Utilize `@if`, `@else`, `@for (item of items; track item.id)` e `@switch` em vez das diretivas estruturais antigas `*ngIf`, `*ngFor`.
4. **Isolamento de Estilos**:
   - Utilize as classes utilitárias do Bulma (`has-text-centered`, `is-flex`, `mt-4`, `p-5`, `columns`, `column`) no template.
   - Deixe o CSS específico de cada componente no seu arquivo `.scss` correspondente apenas para ajustes finos que o Bulma não cubra.
5. **Acessibilidade (a11y)**:
   - Sempre adicione `aria-label` e `role="button"` ao burger do Bulma.
   - Forneça labels legíveis e estados de foco para campos de formulário (`<div class="control has-icons-left">`).
