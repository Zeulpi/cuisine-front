import React from 'react';
import PropTypes from 'prop-types';
import RecipeStepComponent from './RecipeStepComponent.jsx';
import StepArrow from './Step/StepArrow.jsx';
import '../../styles/Recipes/StepBlocks.css';

const StepBlocks = ({ steps, ingredients }) => {
    const stepEntries = Object.entries(steps)
      .map(([index, step]) => ({ ...step, order: parseInt(index), direction: '' }))
      .sort((a, b) => a.order - b.order);
    const total = stepEntries.length;
    stepEntries.length > 0 ? stepEntries[0].stepSimult = false : null; // Si l'etape 1 est restée en simult, on l'enleve
    
    const blocks = [];
    let currentBlock = [];

    stepEntries.forEach((step, i) => {
      // Construire les blocs Etape + simultanées
      const isFirst = i === 0;
      const isSimultaneous = step.stepSimult && !isFirst;
      if (!isSimultaneous) {
        if (currentBlock.length > 0) blocks.push(currentBlock);
        currentBlock = [step];
      } else {
        currentBlock.push(step);
      }

      // Calcul de la direction des fleches de direction etape---->etape
      if (i > 0) {
        const prev = stepEntries[i - 1];
        const key = `${prev.stepSimult}-${step.stepSimult}`;
        switch (key) {
          case 'false-false':
            step.direction = 'down';
            break;
          case 'true-false':
            step.direction = 'left-down';
            break;
          case 'false-true':
            step.direction = 'right-down';
            break;
          case 'true-true':
            step.direction = 'down';
            break;
          default:
            step.direction = ''; // fallback, au cas où
        }
      }
    });
    if (currentBlock.length > 0) blocks.push(currentBlock);   

  
    return (
      <div className="step-blocks">
        {blocks.map((block, blockIndex) => (
          <div className="step-block" key={blockIndex}>
            <div className="step-main">
              {blockIndex !== 0 && (
                <StepArrow direction={stepEntries.find(s => s.order === block[0].order)?.direction} />
              )}
              <RecipeStepComponent
                key={block[0].id}
                order={block[0].order}
                total={total}
                description={block[0].description}
                time={block[0].time}
                timeUnit={block[0].timeUnit}
                simult={block[0].stepSimult}
                operations={block[0].operations}
                ingredients={ingredients}
              />
              {blocks[blockIndex+1] && blockIndex === 0 && block.length >1 && (
                <StepArrow direction='down-down' />
              )}
            </div>
            {block.length > 1 && (
              <div className="step-simult">
                {block.slice(1).map((step, i) => {
                  const direction = stepEntries.find(s => s.order === step.order)?.direction;
                  return (
                    <React.Fragment key={step.id}>
                      <StepArrow direction={direction} />
                      <RecipeStepComponent
                        order={step.order}
                        total={total}
                        description={step.description}
                        time={step.time}
                        timeUnit={step.timeUnit}
                        simult={step.stepSimult}
                        operations={step.operations}
                        ingredients={ingredients}
                      />
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );
};

export default StepBlocks;

StepBlocks.propTypes = {
  steps: PropTypes.object.isRequired,
  ingredients: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
};