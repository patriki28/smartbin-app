import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Color';
import formatDate from '../utils/formatDate';

const formatReportText = (text) => {
    const elements = [];
    const boldPattern = /\*\*(.*?)\*\*/g;
    const h3Pattern = /#### (.*?):/g;
    const h2Pattern = /### (.*?):/g;

    let remainingText = text.replace(/\n/g, ' ').trim();
    let match;

    while ((match = h2Pattern.exec(remainingText)) !== null) {
        const [fullMatch, content] = match;
        const [beforeMatch, afterMatch] = remainingText.split(fullMatch, 2);

        if (beforeMatch) {
            elements.push(beforeMatch);
        }

        elements.push({ type: 'h2', content });

        remainingText = afterMatch;
    }

    while ((match = h3Pattern.exec(remainingText)) !== null) {
        const [fullMatch, content] = match;
        const [beforeMatch, afterMatch] = remainingText.split(fullMatch, 2);

        if (beforeMatch) {
            elements.push(beforeMatch);
        }

        elements.push({ type: 'h3', content });

        remainingText = afterMatch;
    }

    while ((match = boldPattern.exec(remainingText)) !== null) {
        const [fullMatch, content] = match;
        const [beforeMatch, afterMatch] = remainingText.split(fullMatch, 2);

        if (beforeMatch) {
            elements.push(beforeMatch);
        }

        elements.push({ type: 'bold', content });

        remainingText = afterMatch;
    }

    if (remainingText) {
        elements.push(remainingText);
    }

    return elements;
};

export default function AnalyzedReportCard({ item }) {
    const formattedText = formatReportText(item.report_text);

    return (
        <View style={styles.notificationItem}>
            {formattedText.map((element, index) => {
                if (typeof element === 'string') {
                    return (
                        <Text key={index} style={styles.normalText}>
                            {element}
                        </Text>
                    );
                }

                switch (element.type) {
                    case 'h2':
                        return (
                            <Text key={index} style={styles.h2Text}>
                                {element.content}
                            </Text>
                        );
                    case 'h3':
                        return (
                            <Text key={index} style={styles.h3Text}>
                                {element.content}
                            </Text>
                        );
                    case 'bold':
                        return (
                            <Text key={index} style={styles.boldText}>
                                {element.content}
                            </Text>
                        );
                    default:
                        return null;
                }
            })}
            <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    notificationItem: {
        padding: 10,
        backgroundColor: Colors.backgroundColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 8,
    },
    normalText: {
        fontSize: 16,
        color: Colors.textColor,
    },
    boldText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textColor,
    },
    h2Text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textColor,
    },
    h3Text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textColor,
    },
    date: {
        fontSize: 14,
        color: Colors.secondaryColor,
    },
});
