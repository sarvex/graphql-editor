import * as React from 'react';
import { TopButton } from './TopButton';
import * as styles from '../style/UI';
import { HorizontalSpacer } from './HorizontalSpacer';
import { VerticalSpacer } from './VerticalSpacer';
import { Subscribe } from 'unstated';
import { Cloud } from '../cloud/Container';
import { Popup, Actions } from './Popup';
import { Logo } from './Logo';
import { Loading } from '../cloud/ui/Loading';
import { CreateProject } from '../popups/CreateProject';
import { SaveNotYourProject } from '../popups/SaveNotYourProject';
import { DeleteProject } from '../popups/DeleteProject';
import { SaveNotExistingProject } from '../popups/SaveNotExisitingProject';
import { FakerDeployed } from '../popups/FakerDeployed';
import { DeployNotExistingProject } from '../popups/DeployNotExistingProject';
import { LoginToDoThis } from '../popups/LoginToDoThis';
import { LoadFromURL } from '../popups/LoadFromURL';
import { CreateNamespace } from '../popups/CreateNamespace';
type MenuCategory = {
  active: boolean;
  click: () => void;
};

export type UIProps = {
  code: MenuCategory;
  projects: MenuCategory;
  examples: MenuCategory;
};
export class UI extends React.Component<UIProps> {
  render() {
    return (
      <Subscribe to={[Cloud]}>
        {(cloud: typeof Cloud) => {
          const { currentProject } = cloud.state.cloud;
          return (
            <React.Fragment>
              {cloud.state.loadingStack.length > 0 && (
                <Loading
                  onDismiss={cloud.unStackAll}
                  text={cloud.state.loadingStack}
                  errors={cloud.state.errorStack}
                />
              )}
              {cloud.state.popup === 'onBoarding' && (
                <Popup onClose={() => cloud.setState({ popup: null })}>
                  <Logo height={60} />
                  <VerticalSpacer height={50} />
                  <p>
                    Start designing unified systems and enter the future of backend/frontend
                    definition design and <b>deploy mock backends</b> from <b>GraphQL</b> code in
                    minutes.
                  </p>
                  <VerticalSpacer height={50} />
                  <Actions>
                    <TopButton
                      variant={'GreenMidFull'}
                      big
                      onClick={() => {
                        if (!cloud.state.token) {
                          cloud.login();
                        }
                        cloud.setState({
                          popup: 'createProject'
                        });
                      }}
                    >
                      Create new project
                    </TopButton>
                    <HorizontalSpacer />
                    <TopButton
                      big
                      variant={'PinkFull'}
                      onClick={() => {
                        cloud
                          .setState((state) => ({
                            popup: null
                          }))
                          .then(this.props.examples.click);
                      }}
                    >
                      Explore examples
                    </TopButton>
                  </Actions>
                </Popup>
              )}
              {cloud.state.popup === 'createUser' && <CreateNamespace />}
              {cloud.state.popup === 'createProject' && <CreateProject />}
              {cloud.state.popup === 'deleteProject' && <DeleteProject />}
              {cloud.state.popup === 'notYourProject' && (
                <SaveNotYourProject name={currentProject.name} />
              )}
              {cloud.state.popup === 'notYetProject' && <SaveNotExistingProject />}
              {cloud.state.popup === 'notYetDeploy' && <DeployNotExistingProject />}
              {cloud.state.popup === 'fakerDeployed' && <FakerDeployed />}
              {cloud.state.popup === 'loginToContinue' && <LoginToDoThis />}
              {cloud.state.popup === 'loadURL' && <LoadFromURL />}
              <div className={styles.UI}>
                <div className={styles.TopBar}>
                  <div className={styles.Left}>
                    <TopButton
                      active={this.props.code.active}
                      variant={'Pink'}
                      onClick={this.props.code.click}
                    >
                      code
                    </TopButton>
                    <HorizontalSpacer />
                    <TopButton
                      active={this.props.projects.active}
                      variant={'Pink'}
                      onClick={this.props.projects.click}
                    >
                      projects
                    </TopButton>
                    <HorizontalSpacer />
                    <TopButton
                      variant={'Pink'}
                      onClick={() => {
                        this.props.examples.click();
                      }}
                    >
                      examples
                    </TopButton>
                  </div>
                  {currentProject && (
                    <div className={styles.Center}>{currentProject.endpoint.uri}</div>
                  )}
                  <div className={styles.Right}>
                    {cloud.state.token ? (
                      <>
                        <TopButton variant={'Grey'} onClick={cloud.logout}>
                          Logout
                        </TopButton>
                        <HorizontalSpacer />
                      </>
                    ) : (
                      <>
                        <TopButton variant={'Grey'} onClick={cloud.login}>
                          Login
                        </TopButton>
                        <HorizontalSpacer />
                      </>
                    )}
                    {currentProject &&
                      cloud.findInAllFakerProjects(currentProject) && (
                        <>
                          <TopButton
                            variant={'Green'}
                            onClick={() => {}}
                            href={cloud.getFakerURL()}
                            target="_blank"
                          >
                            Faker Cloud
                          </TopButton>
                          <HorizontalSpacer />
                        </>
                      )}
                    <TopButton
                      variant={'Yellow'}
                      onClick={() => {
                        if (!cloud.state.token) {
                          cloud.setState({
                            popup: 'loginToContinue'
                          });
                          return;
                        }
                        if (!currentProject) {
                          cloud.setState({
                            popup: 'notYetProject'
                          });
                          return;
                        }
                        if (cloud.state.cloud.projects.find((p) => p.id === currentProject.id)) {
                          cloud.saveProject();
                          return;
                        }
                        cloud.setState({
                          popup: 'notYourProject'
                        });
                      }}
                    >
                      Save
                    </TopButton>
                    <HorizontalSpacer />
                    <TopButton
                      variant={'Deploy'}
                      onClick={() => {
                        if (!cloud.state.token) {
                          cloud.setState({
                            popup: 'loginToContinue'
                          });
                          return;
                        }
                        if (!currentProject) {
                          cloud.setState({
                            popup: 'notYetDeploy'
                          });
                          return;
                        }
                        if (cloud.state.cloud.projects.find((p) => p.id === currentProject.id)) {
                          cloud.fakerDeployProject().then(() =>
                            cloud.setState({
                              popup: 'fakerDeployed'
                            })
                          );
                          return;
                        }
                        cloud.setState({
                          popup: 'notYourProject'
                        });
                      }}
                    >
                      Mock Backend
                      <img
                        style={{
                          height: 16,
                          marginLeft: 6
                        }}
                        src={require('../assets/export/rocketIcon.png')}
                      />
                    </TopButton>
                  </div>
                </div>
                {this.props.children}
              </div>
            </React.Fragment>
          );
        }}
      </Subscribe>
    );
  }
}
