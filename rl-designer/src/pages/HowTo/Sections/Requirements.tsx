import React from 'react';
import { installBallPatch } from '@/services/onlineBallPatch';
import Button from '@/components/Button/Button';
import { useNotificationStore } from '@/stores/notificationsStore';

import './Requirements.scss';

const Requirements = () => {

  const notificationStore = useNotificationStore();

  const handleInstallBallPatch = async () => {
    installBallPatch()
      .then(response => {
        if (response.success) {
          notificationStore.success('Ball patch installed successfully!');
        } else {
          notificationStore.error(`Error: ${response.error || response.message}`);
        }
      })
      .catch(error => {
        console.error('Error installing ball patch:', error);
        notificationStore.error(`Failed to install ball patch: ${error.message}`);
      });
  };

  return (
    <section className="home__requirements">
        <div className="home__container">
          <h2 className="home__section-title">Requirements</h2>
          <div className="home__requirements-content">
            <div className="home__requirement-item">
              <span className="home__requirement-icon">🎮</span>
              <div>
                <h4>Rocket League</h4>
                <p>The game must be installed on your system</p>
              </div>
            </div>
            <div className="home__requirement-item">
              <span className="home__requirement-icon">🔧</span>
              <div>
                <h4>BakkesMod</h4>
                <p>Required for mod support and customization</p>
              </div>
            </div>
            <div className="home__requirement-item">
              <span className="home__requirement-icon">📁</span>
              <div>
                <h4>AlphaConsole Plugin</h4>
                <p>Must be installed and enabled in BakkesMod</p>
              </div>
            </div>
            <div className="home__requirement-item">
              <span className="home__requirement-icon">⚙️</span>
              <div>
                <Button 
                  className="home__cta-primary" 
                  onClick={handleInstallBallPatch}
                >
                  Install Online Ball Decal Patch
                </Button>
                <p>Since Alpha Console don't allow ball decals in online games
                Click the button above to install the ball patch and use ball decals online</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

export default Requirements;